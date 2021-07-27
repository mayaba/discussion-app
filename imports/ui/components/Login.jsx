import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Row, Col, Form, FormGroup, Input, Label, Button, NavItem, NavLink, Nav, TabContent, TabPane } from 'reactstrap'

const LoginForm = ({ onRegisterSubmit }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState("");

    const submit = e => {
        e.preventDefault();
    
        Meteor.loginWithPassword(username, password);
      };

    return (
        <Container fluid={true} className="p-0 bg-login">
            <Row className="m-0">
                <Col xs="12" className="p-0">
                    <div className="login-card">
                        <div>
                            <div>
                                <a className="logo" href="#javascript">
                                    <img className="img-fluid for-light" src="images/login.png" alt="" />
                                </a>
                            </div>
                            <div className="login-main login-tab">
                                <TabContent activeTab="login" className="content-login">
                                    <TabPane className="fade show" tabId="login">
                                        {/* TODO: Add on submit */}
                                        <Form className="theme-form" onSubmit={submit}>
                                            <h4>Sign in to account</h4>
                                            <p>Enter your email & password to login</p>
                                            <FormGroup>
                                                <Label className="col-form-label">Username</Label>
                                                <Input className="form-control" type="text" required="" placeholder="Username" required onChange={e => setUsername(e.target.value)}/>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label className="col-form-label">Password</Label>
                                                <Input className="form-control" type="password" name="login[password]" value={password} onChange={e => setPassword(e.target.value)} required="" placeholder="*********" />
                                            </FormGroup>
                                            <div className="form-group mb-0 text-center">
                                                <Button color="primary" className="btn-block" type="submit">Sign In</Button>
                                            </div>
                                            <p className="mt-4 mb-0 text-center">Don't have account?<a className="ml-2" href="" onClick={onRegisterSubmit}>Create Account</a></p>
                                        </Form>
                                    </TabPane>
                                </TabContent>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginForm;