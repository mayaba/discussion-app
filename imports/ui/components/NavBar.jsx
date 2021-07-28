import React, { useState } from 'react';
import {
    Navbar,
    NavbarBrand,
    Button
} from 'reactstrap';

const NavBar = (props) => {


    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar className="mb-2 justify-content-between" color="light" light fixed="" expand="md">
                <NavbarBrand href="/" className="ms-md-2">ROBODISCUSSION</NavbarBrand>
                    <Button color="primary" className="btn-block me-lg-2" onClick={() => Meteor.logout()} >LOGOUT</Button>
            </Navbar>
        </div>
    );
}

export default NavBar;