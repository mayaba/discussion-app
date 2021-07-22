import React from 'react';
import { Row, Col, Card, CardBody, Button, Media, InputGroup, InputGroupAddon, Input } from 'reactstrap';


export const DiscussionForm = () => {
    return (
        <Row>
            <Col xl="6 xl-60 box-col-8" lg="12" md="7">
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody>
                                <div className="new-users-social">
                                    <Media>
                                        <Media left className="rounded-circle m-r-15 img-w50" src="images/1.jpg" alt="" />
                                        <Media body className="">
                                            <h6 className="mb-0 f-w-700">{"ELNA"}</h6>
                                            <p>{"January, 12,2019"}</p>
                                        </Media>
                                        {/* <span className="pull-right mt-0"><MoreVertical /></span> */}
                                    </Media>
                                </div>
                                <Media className="img-fluid" alt="" src="images/timeline-1.png" />
                                <div className="timeline-content">
                                    <p>
                                        {"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed urna in justo euismod condimentum. Fusce placerat enim et odio molestie sagittis."}
                                    </p>
                                    <div className="social-chat">
                                        <div className="other-msg">
                                            <Media>
                                                <Media className="img-50 img-fluid m-r-15 rounded-circle img-w50" alt="" src="images/1.jpg" />
                                                <Media body><span className="f-w-600">{"JasonBorne"} <span>{"1 Year Ago"}</span></span>
                                                    <p>{"we are doing dance and singing songs, please vote our post which is very good for all young peoples"}</p>
                                                </Media>
                                            </Media>
                                        </div>
                                        <div className="other-msg">
                                            <Media>
                                                <Media className="img-50 img-fluid m-r-15 rounded-circle img-w50" alt="" src="images/1.jpg" />
                                                <Media body><span className="f-w-600">{"AlexendraDhadio"} <span>{"1 Month Ago"}</span></span>
                                                    <p>{"ohh yeah very good car and its features i will surely vote for it"} </p>
                                                </Media>
                                            </Media>
                                        </div>
                                        <div className="other-msg">
                                            <Media>
                                                <Media className="img-50 img-fluid m-r-15 rounded-circle img-w50" alt="" src="images/1.jpg" />
                                                <Media body><span className="f-w-600">{"OliviaJon"} <span>{"15 Days Ago"}</span></span>
                                                    <p>{"ohh yeah very good car and its features i will surely vote for it"} </p>
                                                </Media>
                                            </Media>
                                        </div>
                                        <div className="your-msg">
                                            <Media>
                                                <Media className="img-50 img-fluid m-r-15 rounded-circle img-w50" alt="" src="images/1.jpg" />
                                                <Media body><span className="f-w-600">{"IssaBell"} <span>{"1 Year Ago"}</span></span>
                                                    <p>{"we are doing dance and singing songs, please vote our post which is very good for all young peoples"}</p>
                                                </Media>
                                            </Media>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Col >
        </Row>
    );
};