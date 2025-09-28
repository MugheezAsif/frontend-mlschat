import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import './groupConversationModal.css';

const GroupConversationModal = ({ show, onClose, onCreate }) => {
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token);
    const authUser = useSelector((state) => state.auth.user);
    const profileUserId = authUser.id;

    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [followers, setFollowers] = useState([]);

    // Fetch followers to show in dropdown
    useEffect(() => {
        if (!profileUserId) return;

        apiFetch(`${APP_BASE_URL}/api/users/${profileUserId}/followers`)
            .then((data) => {
                const validFollowers = data.data
                    .map((f) => f.follower)
                    .filter((f) => f.id !== authUser.id); // exclude self
                setFollowers(validFollowers);
            })
            .catch((error) => console.error('Error fetching followers:', error));
    }, [profileUserId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!groupName || selectedMembers.length < 2) {
            toast.warn('Enter a group name and at least 2 members');
            return;
        }

        try {
            const data = await apiFetch(`${APP_BASE_URL}/api/chats/conversations`, {
                method: 'POST',
                body: JSON.stringify({
                    type: 'group',
                    name: groupName,
                    user_ids: selectedMembers.map((m) => m.value),
                }),
            });
            toast.success('Group created!');
            onCreate(data);
            onClose();
            setGroupName('');
            setSelectedMembers([]);
            window.location.replace(window.location.href);
        } catch (error) {
            console.error(error);
            toast.error('Error creating group');
        }
    };

    const userOptions = followers.map((user) => ({
        value: user.id,
        label: user.name,
        avatar: user.avatar_url,
    }));

    const formatOptionLabel = ({ label, avatar }) => (
        <div className="d-flex align-items-center gap-2">
            <img src={avatar} alt={label} className="rounded-circle" style={{ width: 30, height: 30 }} />
            <span>{label}</span>
        </div>
    );

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create Group Conversation</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Group Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter group name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Select Members</Form.Label>
                        <Select
                            options={userOptions}
                            isMulti
                            value={selectedMembers}
                            onChange={setSelectedMembers}
                            formatOptionLabel={formatOptionLabel}
                            placeholder="Search and select friends..."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" type="submit">Create Group</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default GroupConversationModal;
