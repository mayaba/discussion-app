import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
function AddDiscus({ cancelClicked, user }) {
    const [title, setTitle] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [body, setBody] = useState('');


    const submit = e => {
        e.preventDefault();

        const newDiscussion = {
            title,
            author: user.profile.name,
            authoremail: user.emails[0].address,
            createdAt: new Date(),
            body: body,
            comments: []
        };

        if (imgUrl) {
            newDiscussion.imgUrl = imgUrl;
        }

        Meteor.call('addDiscussion', newDiscussion)
    };

    return (
        <div className="add-discus">
            <p>Add New Discussion</p>
            <div>
                <Form onSubmit={submit}>
                    <FormGroup>
                        <Label >Title</Label>
                        <Input className="input-txt" type="text" required="" placeholder="The Title of The Discussion" onChange={e => setTitle(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label >Image URL (optional)</Label>
                        <Input type="text" required="" placeholder="The URL of The Discussion Image" onChange={e => setImgUrl(e.target.value)} />
                    </FormGroup>
                    <FormGroup>
                        <Label >Body</Label>
                        <textarea placeholder="Write something.."></textarea>
                    </FormGroup>

                    <div className="form-group mb-0 text-center">
                        <Button color="primary" className="btn-block" type="submit">Submit</Button>
                    </div>
                </Form>
            </div>
        </div>

    );

}

export default AddDiscus
