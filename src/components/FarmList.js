import React, { useState, useEffect, useCallback } from 'react';
import FarmsDataService from "../services/farms";
import { Link, useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { BsHeart, BsHeartFill } from "react-icons/bs";
import "./FarmList.css";


const FarmList = ({
    user,
    favorites,
    addFavorite,
    deleteFavorite
}) => {
    const [farms, setFarms] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [entriesPerPage, setEntriesPerPage] = useState(0);
    const [currentSearchMode, setCurrentSearchMode] = useState("");

    let params = useParams();

    useEffect(() => {
        if (params && params.title) {
            setSearchTitle(params.title);
        }
    }, [params]);

    const retrieveFarms = useCallback(() => {
        setCurrentSearchMode("");
        FarmsDataService.getAll(currentPage)
            .then(response => {
                setFarms(response.data.farms);
                setCurrentPage(response.data.page);
                setEntriesPerPage(response.data.entries_per_page);
            })
            .catch(e => {
                console.log(e);
            });
    }, [currentPage]);

    const find = useCallback((query, by) => {
        FarmsDataService.find(query, by, currentPage)
            .then(response => {
                setFarms(response.data.farms);
            })
            .catch(e => {
                console.log(e);
            });
    }, [currentPage]);

    const findByTitle = useCallback(() => {
        setCurrentSearchMode("findByTitle");
        find(searchTitle, "name");
    }, [find, searchTitle]);

    const retrieveNextPage = useCallback(() => {
        if (currentSearchMode === "findByTitle") {
            findByTitle();
        } else {
            retrieveFarms();
        }
    }, [currentSearchMode, findByTitle, retrieveFarms]); // findByRating

    useEffect(() => {
        setCurrentPage(0);
    }, [currentSearchMode]);

    // Retrieve the next page if currentPage value changes
    useEffect(() => {
        retrieveNextPage();
    }, [currentPage, retrieveNextPage]);


    const onChangeSearchTitle = e => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
        findByTitle();
    }


    return (
        <div className='App'>
            <br />
            <div className="search-box">
                <Container>
                    <br />
                    <Row className="justify-content-center">
                        <Col md={10} lg={8}>
                            <Form>
                                <Card className="card-sm">
                                    <Card.Body className="no-gutters align-items-center">
                                        <Row>
                                            <Col>
                                                <Form.Control
                                                    className="form-control form-control-lg form-control-borderless"
                                                    type="search"
                                                    placeholder="Search by title.."
                                                    value={searchTitle}
                                                    onChange={onChangeSearchTitle}
                                                />
                                            </Col>
                                            <Col className="col-auto">
                                                <Button
                                                    variant="outline-dark"
                                                    type="button"
                                                    onClick={findByTitle}
                                                >
                                                    Search
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
            {/* <Container className='main-container home-container'> */}
            <Row className='farmListRow'>
                {farms.map((farm) => {
                    return (
                        <Col key={farm._id}>
                            <Card className='farmsListPageCard'>
                                {user && (
                                    favorites.includes(farm._id) ?
                                        <BsHeartFill className='heart heartFill' onClick={() => {
                                            deleteFavorite(farm._id);
                                        }} />
                                        :
                                        <BsHeart className='heart heartEmpty' onClick={() => {
                                            addFavorite(farm._id);
                                        }} />

                                )}
                                <Card.Img
                                    className='smallPoster'
                                    src={farm.cover_image}
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = `${process.env.PUBLIC_URL}/images/cherry2.jpeg`;
                                    }}
                                />
                                <Card.Body className='cardBody'>
                                    <Card.Title> {farm.farm_name}</Card.Title>
                                    <Card.Text>
                                        {farm.address}
                                    </Card.Text>
                                    <Link to={"/farms/" + farm._id}>
                                        <Button variant="outline-secondary" className='farmListDetailButton'>
                                            See Details
                                        </Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
            <br />

            Showing page: {currentPage + 1}.
            <Button
                variant="link"
                onClick={() => { setCurrentPage(currentPage + 1) }}
            >
                Get next {entriesPerPage} results
            </Button>
            {/* </Container> */}
        </div>
    )
}


export default FarmList;