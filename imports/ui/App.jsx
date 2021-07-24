import React, { useState } from 'react';
import { DiscussionForm } from "./components/DiscussionForm";
import { useTracker } from 'meteor/react-meteor-data';
import { DiscussionCollection } from "/imports/api/discussion";
import { UsersCollection } from "/imports/api/appUsers";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { Row, Col, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';


export const App = () => {
  const authUser = useTracker(() => Meteor.user());
  const [verticleTab, setVerticleTab] = useState('');
  const [register, setRegister] = useState(false);
  const discussions = [];
  const titles = [];

  useTracker(() => DiscussionCollection.find({}).forEach(d => {
    if (authUser) {
      // get the user from userscollection
      userInfo = UsersCollection.findOne({ username: authUser.username });
      discussions.push(<DiscussionForm key={d._id} discussion={d} user={userInfo} />);
      titles.push(d.title);
    }
  }));

  return (
    <>
      {
        authUser ? (
          <>
            {discussions.length > 0 ? (
              <div>
                <Row>
                  <Col sm="3" xs="12">
                    <Nav className="nav flex-column nav-pills">
                      {
                        titles.map((t, i) => {
                          return (
                            <NavItem key={i}>
                              <NavLink href="#" className={verticleTab === i ? 'active' : ''} onClick={() => setVerticleTab(i)}>{t}</NavLink>
                            </NavItem>
                          );
                        })
                      }
                    </Nav>
                  </Col>
                  <Col sm="9" xs="12">
                    {discussions[verticleTab]}
                  </Col>
                </Row>
              </div>
            ) : (
              <h1>Loading results ...</h1>
            )}
          </>
        ) : (
          register ? <RegisterForm /> : <LoginForm onRegisterSubmit={() => setRegister(true)}/>
        )
      }
    </>
  )
};
