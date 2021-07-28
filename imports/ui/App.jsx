import React, { useState } from 'react';
import { DiscussionForm } from "./components/DiscussionForm";
import { useTracker } from 'meteor/react-meteor-data';
import { DiscussionCollection } from "/imports/db/discussion";
import RegisterForm from "./components/Register";
import AddDiscus from "./components/AddDiscus";
import LoginForm from "./components/Login";
import { Row, Col, Nav, NavItem, NavLink, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';


export const App = () => {
  const authUser = useTracker(() => Meteor.user());
  const [verticleTab, setVerticleTab] = useState(1);
  const [register, setRegister] = useState(false);
  const [addDiscussion, setAddDiscussion] = useState(false);
  const discussions = [{}];

  useTracker(() => DiscussionCollection.find({}).forEach(d => {
    if (authUser) {
      console.log(authUser)
      discussions.push({
        title: d.title,
        discusObj: <DiscussionForm key={d._id} discussion={d} user={authUser} />
      });
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
                            <NavItem key={i}>
                              <NavLink href="#" className={verticleTab === i ? 'active' : ''} onClick={() => setVerticleTab(i)}>{d.title}</NavLink>
                            </NavItem>
                          );
                        })
                      }
                    </Nav>
                    <div className="text-center mt-2">
                      <Button outline color="secondary" onClick={() => setAddDiscussion(true)}>Add new discussion</Button>
                    </div>
                  </Col>
                  <Col sm="9" xs="12">
                    {
                      addDiscussion ?
                        <AddDiscus user={authUser} cancelClicked={() => setAddDiscussion(false)} />
                        :
                        discussions[verticleTab].discusObj}
                  </Col>
                </Row>
              </div>
            ) : (
              <h1>Loading results ...</h1>
            )}
          </>
        ) : (
          register ? <RegisterForm onClickSubmit={() => setRegister(false)} /> : <LoginForm onRegisterSubmit={() => setRegister(true)} />
        )
      }
    </>
  )
};
