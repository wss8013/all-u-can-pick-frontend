import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import FarmsDataService from "../services/farms.js";
import "./FarmPage.css"
import Alert from 'react-bootstrap/Alert';

const FarmPage = ({ user }) => {

    let params = useParams();
    const [farm, setFarm] = useState({
        id: null,
        address: "",
        website: "",
        phone: "",
        fruit_season: [],
        photo_gallery: [],
        farm_name: "",
        cover_image: "",
        fruits: [],
        reviews: []
    });

    const getFarm = id => {
        FarmsDataService.findById(id)
            .then(response => {
                setFarm(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const getSeason = seasonNum => {
        switch (seasonNum) {
            case "1":
                return " January ";
            case "2":
                return " Febuary ";
            case "3":
                return " March ";
            case "4":
                return " April ";
            case "5":
                return " May ";
            case "6":
                return " June ";
            case "7":
                return " July ";
            case "8":
                return " August ";
            case "9":
                return " September ";
            case "10":
                return " October ";
            case "11":
                return " November ";
            case "12":
                return " December ";
            default:
            // code block
        }
        return "error month";
    };

    useEffect(() => {
        getFarm(params.id)
    }, [params.id]);

    const deleteReview = (reviewId, index) => {
        let data = {
            review_id: reviewId,
            user_id: user.googleId
        }
        FarmsDataService.deleteReview(data)
            .then(response => {
                setFarm((prevState) => {
                    prevState.reviews.splice(index, 1);
                    return ({
                        ...prevState
                    })
                })
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
        <div className='page'>
            <Container>
                <Row>
                    <Col className='coverCol'>
                        <div >
                            <p></p>
                            <Image className='personpic'
                                src={farm.cover_image}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = `${process.env.PUBLIC_URL}/images/NoPosterAvailable-crop.jpg`;
                                }}
                            />
                        </div>
                    </Col>
                    <Col>
                        <p></p>
                        <div className='list'>
                            <li>Farm Name:{farm.farm_name}</li>
                            <br></br>
                            <li>Address:<a href={"http://maps.google.com/?q=" + farm.address} target="_blank" >{farm.address}</a></li>
                            <br></br>
                            <li>Website:<Alert.Link href={farm.website} target="_blank"> {farm.website} </Alert.Link></li>
                            <br></br>
                            <li>Phone:{farm.phone}</li>
                            <br></br>
                            <li>Fruit Season:{farm.fruit_season.map((seasonNum) => {
                                return (getSeason(seasonNum));
                            })}</li>
                            <br></br>
                            <li>Fruits:{farm.fruits.map((fruit, index) => {
                                return (<p className='fruits'>{fruit} </p>)
                            })}</li>
                        </div>
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <h2>Reviews</h2>
                    <Card className='card'>
                        <Card.Header as='h5'>{farm.farm_name}</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                {farm.reviews.map((review, index) => {
                                    return (
                                        <div className='personreview'>
                                            <div className='singlereview'>
                                                <br></br>
                                                <Row>
                                                    <h5 className='reviewName'>{review.name}</h5>
                                                </Row>
                                                <p className="review">{review.review}</p>
                                                {user && user.googleId === review.user_id &&
                                                    <Row>
                                                        <Col>
                                                            <Link to={{
                                                                pathname: "/farms/" + params.id + "/review"
                                                            }}
                                                                state={{
                                                                    currentReview: review
                                                                }} >
                                                                <Button variant="outline-danger" size="sm">Edit</Button>
                                                            </Link>
                                                        </Col>
                                                        <Col>
                                                            <Button variant='link' onClick={() => {
                                                                deleteReview(review._id, index)
                                                            }}>
                                                                <Button variant="outline-danger" size="sm">Delete</Button>
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                }
                                            </div>
                                        </div>
                                    )
                                })}
                                {user && <Link to={"/farms/" + params.id + "/review"}><Button variant="outline-dark">Add Review</Button> </Link>}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Row>
                <br></br>
                <Row>
                    <h2>Photos</h2>
                    <Container className='main-container'>
                        <Row className='farmReviewRow'>
                            {farm.photo_gallery.map((url, index) => {
                                return (
                                    <Col key={index} className="mb-3">
                                        <Card className='farmphoto'>
                                            <Card.Img
                                                className='smallphoto'
                                                src={url}
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = `${process.env.PUBLIC_URL}/images/NoPosterAvailable-crop.jpg`;
                                                }}
                                            />
                                        </Card>
                                    </Col>
                                )
                            })}
                        </Row>
                    </Container>
                </Row>
            </Container>
        </div>
    )
}

export default FarmPage;
