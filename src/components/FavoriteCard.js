import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes.js'
import Image from "react-bootstrap/Image";
import style from "./favorites.css"
import Alert from 'react-bootstrap/Alert';


const myStyle = {
    padding: "10px",
    marginBottom: "0.5rem",
    backgroundColor: "white"
}
export const Card = ({ id, farm, index, moveCard }) => {
    const ref = useRef(null)
    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.CARD,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }
            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex)
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.CARD,
        item: () => {
            return { id, index }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    const opacity = isDragging ? 0 : 1
    drag(drop(ref))
    return (
        <div style={{ ...myStyle, opacity }}>
            <div className="favoritesCard card" ref={ref} data-handler-id={handlerId}>
                <div className="favoritesNumber favoritesNumberOneDigit">{index + 1}</div>
                <div>
                    <Image
                        className="card-img favoritesPoster"
                        src={farm.cover_image}
                        onError={(e) => {
                            e.target.src = '/images/NoPosterAvailable-crop.jpeg'
                        }}
                        fluid />
                </div>
                <div className="textContent">
                    <div className="favoritesTitle">
                        {farm.farm_name}
                    </div>
                    <div className="contactInfo">
                        {farm.address}
                    </div>
                    <Alert.Link href={farm.website} target="_blank">Link To Farm Website</Alert.Link>
                </div>
            </div>
        </div>
    )
}
