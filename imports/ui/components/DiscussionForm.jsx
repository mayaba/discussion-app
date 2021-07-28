import React, { useState } from 'react';
import { Mongo } from 'meteor/mongo';
import { DiscussionCollection } from "/imports/db/discussion";
import { Row, Col, Card, CardBody, Button, Media, InputGroup, InputGroupAddon, Input } from 'reactstrap';


export const DiscussionForm = ({ discussion, user }) => {
    const [reply, setReply] = useState("");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const createdDate = discussion.createdAt;


    console.log(user);

    const handleSubmit = e => {
        e.preventDefault();

        if (!reply) return;

        const newcomment = {
            id: new Mongo.ObjectID(),
            username: user.username,
            name: user.name,
            createdAt: new Date(),
            body: reply.trim()
        };

        // TODO: use methods instead
        DiscussionCollection.update(
            { _id: discussion._id },
            { $push: { comments: newcomment } }
        );



        setReply("");
    };

    return (
        <>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody>
                                <div className="new-users-social">
                                    <Media>
                                        <Media left className="rounded-circle m-r-15 img-w60" src={`https://robohash.org/${discussion._id}`} alt="" />
                                        <Media body className="">
                                            <h6 className="mb-0 f-w-700">{discussion.name}</h6>
                                            <p>{discussion.username} {months[createdDate.getMonth()]}, {createdDate.getDate()}, {createdDate.getFullYear()}</p>
                                        </Media>
                                    </Media>
                                </div>
                                <Media className="img-fluid mx-auto" alt="" src={discussion.img_url} />
                                <div className="timeline-content">
                                    <p>{discussion.body}</p>
                                    <div className="social-chat">
                                        <div className="other-msg">
                                            {discussion.comments.map(comment => {
                                                const createdAt = comment.createdAt;
                                                return (
                                                    <div key={comment.id} className="pb-3">
                                                        <Media>
                                                            <Media className="img-fluid m-r-15 rounded-circle img-w60" alt="" src={`https://robohash.org/${comment.username}`} />
                                                            <Media body><span className="f-w-600">{comment.name} <span>"{comment.username}" {months[createdDate.getMonth()]}, {createdDate.getDate()}, {createdDate.getFullYear()}</span></span>
                                                                <p>{comment.body}</p>
                                                            </Media>
                                                        </Media>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="comments-box">
                                            <form onSubmit={handleSubmit}>
                                                <Media>
                                                    <Media className="img-w60 img-fluid m-r-15 rounded-circle" src={`https://robohash.org/${user.username}`} alt="" />
                                                    <Media body>
                                                        <InputGroup className="text-box">
                                                            <Input className="form-control input-txt-bx mt-1" type="text" name="message-to-send" placeholder="Post Your comment" value={reply} onChange={(e) => setReply(e.target.value)} />
                                                            <InputGroupAddon addonType="append">
                                                                <Button outline color="secondary" type="submit" className="mt-1 ml-5">Submit</Button>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </Media>
                                                </Media>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

        </>
    );
};