import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Alert, Container, Row, Col, Form, FormGroup, Input, Label, Button, NavItem, NavLink, Nav, TabContent, TabPane } from 'reactstrap'

const Register = ({ onClickSubmit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState(false);
    const [errmsg, setErrmsg] = useState('');

    const submit = e => {
        e.preventDefault();

        if (!name || !email || !password) {
            setErrmsg("Problem in registering. Please make sure that the name, email, and password are not empty");
            setAlert(true);
            return;
        }

        try {
            Meteor.call('createuser', email, password, name);
        } catch (error) {
            setErrmsg("Problem in registering. Please make sure that the name, email, and password are not empty" + error.message);
            setAlert(true);
            return;
        }


        Meteor.loginWithPassword(email, password, (err) => {
            setErrmsg("Email or Password is incorrect");
            setAlert(true);
        });
        onClickSubmit();

    };

    return (
        <Container fluid={true} className="p-0 bg-login">
            <Row className="m-0">
                <Col xs="12" className="p-0">
                    <div className="login-card">
                        <div>
                            <div className="login-main login-tab">
                                <a className="logo" href="#javascript">
                                    <img className="img-fluid" src="images/login.png" alt="" width="250" height="34" />
                                </a>
                                <TabContent activeTab="login" className="content-login">
                                    <TabPane className="fade show" tabId="login">
                                        <Form className="theme-form" onSubmit={submit}>
                                            <div className="text-center">
                                                <h4>Creare An Account</h4>
                                                <p>Enter your name, email & password to Register</p>
                                                {
                                                    alert ?
                                                        <Alert color="danger">
                                                            {errmsg}
                                                        </Alert>
                                                        :
                                                        ""
                                                }
                                            </div>
                                            <FormGroup>
                                                <Label className="col-form-label">Name</Label>
                                                <Input className="form-control" type="text" required="" placeholder="John Smith" onChange={e => setName(e.target.value)} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label className="col-form-label">Email Address</Label>
                                                <Input className="form-control" type="email" required="" placeholder="Test@gmail.com" onChange={e => setEmail(e.target.value)} />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label className="col-form-label">Password</Label>
                                                <Input className="form-control" type="password" name="login[password]" value={password} onChange={e => setPassword(e.target.value)} required="" placeholder="*********" />
                                            </FormGroup>
                                            <div className="form-group mb-0 text-center">
                                                <Button color="primary" className="btn-block" type="submit">Register</Button>
                                            </div>
                                            <p className="mt-4 mb-0 text-center">Don't have account?  <span role="button" className="ml-2 text-primary" onClick={onClickSubmit}> Sign In</span></p>
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

export default Register;