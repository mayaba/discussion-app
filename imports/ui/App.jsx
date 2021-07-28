import React, { useState } from 'react';
import { DiscussionForm } from "./components/DiscussionForm";
import { useTracker } from 'meteor/react-meteor-data';
import { DiscussionCollection } from "/imports/db/discussion";
import { UsersCollection } from "/imports/db/appUsers";
import RegisterForm from "./components/Register";
import Popup from "./components/Popup";
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
      // get the user from userscollection
      console.log(authUser)
      userInfo = UsersCollection.findOne({ username: authUser.username });
      discussions.push({
        title: d.title,
        discusObj: <DiscussionForm key={d._id} discussion={d} user={userInfo} />
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
                      {/* <div className="align-self-end">
                        <Button outline color="secondary" onClick={() => setAddDiscussion(true)}>Add new discussion</Button>
                      </div> */}
                    </Nav>
                    <div className="text-center mt-2">
                      <Button outline color="secondary" onClick={() => setAddDiscussion(true)}>Add new discussion</Button>
                    </div>
                  </Col>
                  <Col sm="9" xs="12">
                    {
                      addDiscussion ?
                        <>
                          <h1>Add Discussion</h1>
                          <Popup closeClicked={() => setAddDiscussion(false)}><p>this is a popup</p></Popup>
                        </>
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
