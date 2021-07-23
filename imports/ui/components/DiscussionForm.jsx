import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { DiscussionCollection } from "/imports/api/discussion";
import { Row, Col, Card, CardBody, Button, Media, InputGroup, InputGroupAddon, Input } from 'reactstrap';


export const DiscussionForm = ({ discussion }) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const createdDate = discussion.createdAt;

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
                                            <h6 className="mb-0 f-w-700">{discussion.name}</h6>
                                            <p>{discussion.username} {months[createdDate.getMonth()]}, {createdDate.getDate()}, {createdDate.getFullYear()}</p>
                                        </Media>
                                        {/* <span className="pull-right mt-0"><MoreVertical /></span> */}
                                    </Media>
                                </div>
                                <Media className="img-fluid" alt="" src={discussion.img_url} />
                                <div className="timeline-content">
                                    <p>{discussion.body}</p>
                                    <div className="social-chat">
                                        <div className="other-msg">
                                            {discussion.comments.map(comment => {
                                                const createdAt = comment.createdAt;
                                                return (
                                                    <Media>
                                                        <Media className="img-50 img-fluid m-r-15 rounded-circle img-w50" alt="" src="images/1.jpg" />
                                                        <Media body><span className="f-w-600">{comment.name} <span>"{comment.username}" {months[createdDate.getMonth()]}, {createdDate.getDate()}, {createdDate.getFullYear()}</span></span>
                                                        <p>{comment.body}</p>
                                                        </Media>
                                                    </Media>
                                                )
                                            })}
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