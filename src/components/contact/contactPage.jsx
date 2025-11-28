'use client';

import React from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Collapse,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { contactService } from '@/services/contactService';

const initialFormState = {
    name: '',
    email: '',
    phone: '',
    gender: '',
    message: '',
};

export default function ContactPage() {
    const [contacts, setContacts] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState(initialFormState);
    const [formError, setFormError] = React.useState('');
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const [deletingId, setDeletingId] = React.useState(null);
    const [feedback, setFeedback] = React.useState({ type: '', message: '' });

    React.useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        setLoading(true);
        try {
            const data = await contactService.getAll();
            setContacts(Array.isArray(data) ? data : []);
        } catch (error) {
            setFeedback({
                type: 'error',
                message: error.message || 'Failed to fetch contacts',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formError) {
            setFormError('');
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setFormData(initialFormState);
        setFormError('');
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.gender || !formData.message) {
            setFormError('All fields are required.');
            return false;
        }
        return true;
    };

    const handleDelete = async (id) => {
        if (!id || !window.confirm('Are you sure you want to delete this contact?')) {
            return;
        }
        setDeletingId(id);
        try {
            await contactService.delete(id);
            setContacts((prev) => prev.filter((contact) => contact._id !== id));
            setFeedback({ type: 'success', message: 'Contact removed successfully.' });
        } catch (error) {
            setFeedback({
                type: 'error',
                message: error.message || 'Failed to delete contact.',
            });
        } finally {
            setDeletingId(null);
        }
    };

    const renderTableContent = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress size={60} sx={{ color: '#6366f1' }} />
                </Box>
            );
        }

        if (!contacts.length) {
            return (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <ContactMailIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" sx={{ mb: 1 }}>
                        No contact entries found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Start by adding a contact entry using the button above.
                    </Typography>
                </Box>
            );
        }

        return (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Gender</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact) => (
                            <TableRow key={contact._id}>
                                <TableCell>{contact.name}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.phone}</TableCell>
                                <TableCell sx={{ textTransform: 'capitalize' }}>{contact.gender}</TableCell>
                                <TableCell sx={{ maxWidth: '250px' }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {contact.message}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {contact.createdAt
                                        ? new Date(contact.createdAt).toLocaleString()
                                        : '—'}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Delete contact">
                                        <span>
                                            <IconButton
                                                onClick={() => handleDelete(contact._id)}
                                                disabled={deletingId === contact._id}
                                                sx={{
                                                    color: '#ef4444',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                                    },
                                                }}
                                            >
                                                {deletingId === contact._id ? (
                                                    <CircularProgress size={20} color="inherit" />
                                                ) : (
                                                    <DeleteIcon />
                                                )}
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 64px)',
                background: 'linear-gradient(to bottom, #eef2ff 0%, #f8fafc 60%)',
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        gap: 2,
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}
                        >
                            Contact Management
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Review, add, and delete contact enquiries from the website.
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Refresh list">
                            <span>
                                <IconButton
                                    onClick={loadContacts}
                                    disabled={loading}
                                    sx={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '10px',
                                    }}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                </Box>

                <Collapse in={Boolean(feedback.message)}>
                    {feedback.message && (
                        <Alert
                            severity={feedback.type || 'info'}
                            onClose={() => setFeedback({ type: '', message: '' })}
                            sx={{ mb: 3, borderRadius: '12px' }}
                        >
                            {feedback.message}
                        </Alert>
                    )}
                </Collapse>

                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                        background: '#ffffff',
                    }}
                >
                    {renderTableContent()}
                </Paper>
            </Container>
        </Box>
    );
}

