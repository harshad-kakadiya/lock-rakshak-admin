'use client';

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    CircularProgress,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Avatar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import CloseIcon from '@mui/icons-material/Close';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { videoService } from '@/services/videoService';

export default function VideoPage() {
    const [videos, setVideos] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openVideoModal, setOpenVideoModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [editingVideo, setEditingVideo] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        image: null,
        imageUrl: '',
    });
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        setLoading(true);
        try {
            const data = await videoService.getAll();
            setVideos(data);
        } catch (error) {
            console.error('Error loading videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddDialog = () => {
        setEditingVideo(null);
        setFormData({
            title: '',
            description: '',
            videoUrl: '',
            image: null,
            imageUrl: '',
        });
        setOpenDialog(true);
    };

    const handleOpenVideoModal = (video) => {
        setSelectedVideo(video);
        setOpenVideoModal(true);
    };

    const handleCloseVideoModal = () => {
        setOpenVideoModal(false);
        setSelectedVideo(null);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingVideo(null);
        setFormData({
            title: '',
            description: '',
            videoUrl: '',
            image: null,
            imageUrl: '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    image: file,
                    imageUrl: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.description || !formData.videoUrl) {
            alert('Please fill in all required fields, including the video link');
            return;
        }

        setLoading(true);
        try {
            await videoService.create(formData);
            await loadVideos();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving video:', error);
            alert('Error saving video. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e?.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this video?')) {
            return;
        }
        setLoading(true);
        try {
            await videoService.delete(id);
            await loadVideos();
        } catch (error) {
            console.error('Error deleting video:', error);
            alert('Error deleting video. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: 'calc(100vh - 64px)', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
            <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
                    <Box>
                        <Typography
                            variant="h3"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                color: '#ffffff',
                                mb: 1,
                                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                            }}
                        >
                            Video Library
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
                            {videos.length} {videos.length === 1 ? 'video' : 'videos'} in your collection
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddDialog}
                        sx={{
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                            borderRadius: '16px',
                            background: '#ffffff',
                            color: '#667eea',
                            fontWeight: 600,
                            fontSize: '1rem',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                            '&:hover': {
                                background: '#f8f9fa',
                                boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Add New Video
                    </Button>
                </Box>

                {loading && videos.length === 0 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                        <CircularProgress size={80} sx={{ color: '#ffffff' }} />
                    </Box>
                ) : videos.length === 0 ? (
                    <Card
                        sx={{
                            textAlign: 'center',
                            py: 10,
                            px: 4,
                            borderRadius: '24px',
                            background: '#ffffff',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                        }}
                    >
                        <VideoLibraryIcon sx={{ fontSize: 100, color: '#cbd5e1', mb: 3 }} />
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                            No videos yet
                        </Typography>
                        <Typography variant="body1" color="textSecondary" sx={{ mb: 4, fontSize: '1.1rem' }}>
                            Start building your video library by adding your first video
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenAddDialog}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '16px',
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                                '&:hover': {
                                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
                                },
                            }}
                        >
                            Add Your First Video
                        </Button>
                    </Card>
                ) : (
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            overflow: 'hidden',
                            background: '#ffffff',
                        }}
                    >
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>Thumbnail</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }} align="right">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {videos.map((video) => (
                                        <TableRow
                                            key={video.id ?? video._id}
                                            onClick={() => handleOpenVideoModal(video)}
                                            sx={{
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                                                },
                                            }}
                                        >
                                            <TableCell>
                                                <Avatar
                                                    src={video.image}
                                                    variant="rounded"
                                                    sx={{
                                                        width: 100,
                                                        height: 60,
                                                        borderRadius: '8px',
                                                    }}
                                                >
                                                    <VideoLibraryIcon />
                                                </Avatar>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                    {video.title}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                    sx={{
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        maxWidth: '400px',
                                                    }}
                                                >
                                                    {video.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Delete video">
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(video.id ?? video._id, e);
                                                        }}
                                                        sx={{
                                                            color: '#ef4444',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                            },
                                                        }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}

                {/* Video Player Modal */}
                <Modal
                    open={openVideoModal}
                    onClose={handleCloseVideoModal}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                    }}
                >
                    <Paper
                        sx={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '900px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            background: '#000000',
                            boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
                        }}
                    >
                        <IconButton
                            onClick={handleCloseVideoModal}
                            sx={{
                                position: 'absolute',
                                top: 16,
                                right: 16,
                                zIndex: 10,
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                color: '#ffffff',
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.3)',
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        {selectedVideo && (
                            <Box>
                                <video
                                    src={selectedVideo.videoUrl}
                                    controls
                                    autoPlay
                                    style={{
                                        width: '100%',
                                        maxHeight: '80vh',
                                        display: 'block',
                                    }}
                                />
                                <Box sx={{ p: 3, background: '#ffffff' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1e293b' }}>
                                        {selectedVideo.title}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        {selectedVideo.description}
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Paper>
                </Modal>

                {/* Add/Edit Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: '24px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        },
                    }}
                >
                    <DialogTitle
                        sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#ffffff',
                            fontWeight: 700,
                            py: 3,
                            fontSize: '1.5rem',
                        }}
                    >
                        {editingVideo ? 'Edit Video' : 'Add New Video'}
                    </DialogTitle>
                    <DialogContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, pt: 2 }}>
                            <TextField
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    },
                                }}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                multiline
                                rows={4}
                                variant="outlined"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    },
                                }}
                            />
                            <TextField
                                label="Video Link"
                                name="videoUrl"
                                value={formData.videoUrl}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                variant="outlined"
                                placeholder="https://example.com/video.mp4"
                                helperText="Paste a direct video URL or streaming link"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    },
                                }}
                            />
                            <Box>
                                <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500, color: '#475569' }}>
                                    Image (Thumbnail)
                                </Typography>
                                <Box
                                    sx={{
                                        border: '2px dashed #cbd5e1',
                                        borderRadius: '12px',
                                        p: 3,
                                        textAlign: 'center',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: '#667eea',
                                            backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                        },
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageFileChange}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </Box>
                                {formData.imageUrl && (
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            style={{
                                                width: '100%',
                                                maxHeight: '300px',
                                                objectFit: 'contain',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                            {formData.videoUrl && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>
                                        Video Preview
                                    </Typography>
                                    <video
                                        src={formData.videoUrl}
                                        width="100%"
                                        height="250"
                                        controls
                                        style={{
                                            borderRadius: '16px',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 4, pt: 2 }}>
                        <Button
                            onClick={handleCloseDialog}
                            disabled={loading}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '12px',
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={loading}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '12px',
                                px: 4,
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : editingVideo ? 'Update Video' : 'Add Video'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}
