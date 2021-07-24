import React, { useState } from 'react';
import { DiscussionForm } from "./components/DiscussionForm";
import { useTracker } from 'meteor/react-meteor-data';
import { DiscussionCollection } from "/imports/api/discussion";
import { UsersCollection } from "/imports/api/appUsers";
import { LoginForm } from "./components/LoginForm";
import { Row, Col, Card, CardBody, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';


export const App = () => {
  const authUser = useTracker(() => Meteor.user());
  const [verticleTab, setVerticleTab] = useState('');
  const discussions = [];

  useTracker(() => DiscussionCollection.find({}).forEach(d => {
    if (authUser) {
      // get the user from userscollection
      userInfo = UsersCollection.findOne({ username: authUser.username });
      discussions.push(<DiscussionForm key={d._id} discussion={d} user={userInfo} />);
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
                        discussions.map((d, i) => {
                          return (
                            <NavItem>
                              <NavLink href="#" className={verticleTab === i ? 'active' : ''} onClick={() => setVerticleTab(i)}>Discussion 1</NavLink>
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
          <LoginForm />
        )
      }
    </>
  )
};
