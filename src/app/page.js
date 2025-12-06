'use client';

import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import Link from 'next/link';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import ArticleIcon from '@mui/icons-material/Article';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Home() {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const features = [
        {
            title: 'Video Management',
            description: 'Upload, edit, and manage your video content with ease',
            icon: VideoLibraryIcon,
            link: '/video',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            glowColor: 'rgba(102, 126, 234, 0.4)',
        },
        {
            title: 'Gallery Management',
            description: 'Organize and showcase your photo collection',
            icon: PhotoLibraryIcon,
            link: '/gallery',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            glowColor: 'rgba(240, 147, 251, 0.4)',
        },
        {
            title: 'Press Release',
            description: 'Manage press releases with images and links',
            icon: ArticleIcon,
            link: '/press-release',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            glowColor: 'rgba(79, 172, 254, 0.4)',
        },
        {
            title: 'Contact Management',
            description: 'Review and respond to contact form submissions',
            icon: ContactMailIcon,
            link: '/contact',
            gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            glowColor: 'rgba(67, 233, 123, 0.4)',
        },
        {
            title: 'Slide Image',
            description: 'Manage and organize slide images for your content',
            icon: SlideshowIcon,
            link: '/slide-image',
            gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            glowColor: 'rgba(250, 112, 154, 0.4)',
        },
        {
            title: 'Person Detail',
            description: 'Manage and organize person details and information',
            icon: PersonIcon,
            link: '/person-detail',
            gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
            glowColor: 'rgba(48, 207, 208, 0.4)',
        },
        {
            title: 'Category',
            description: 'Create and manage categories for organizing content',
            icon: CategoryIcon,
            link: '/category',
            gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            glowColor: 'rgba(168, 237, 234, 0.4)',
        },
        {
            title: 'About',
            description: 'Manage about page entries with team member information',
            icon: InfoIcon,
            link: '/about',
            gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
            glowColor: 'rgba(255, 154, 86, 0.4)',
        },
        {
            title: 'Location',
            description: 'Manage location links and Google Maps URLs',
            icon: LocationOnIcon,
            link: '/location',
            gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            glowColor: 'rgba(255, 236, 210, 0.4)',
        },
    ];

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                position: 'relative',
                overflow: 'hidden',
                py: { xs: 6, sm: 8, md: 10 },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(240, 147, 251, 0.2) 0%, transparent 50%)',
                    pointerEvents: 'none',
                },
            }}
        >
            {/* Floating particles effect */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                }}
            >
                {[...Array(20)].map((_, i) => (
                    <Box
                        key={i}
                        sx={{
                            position: 'absolute',
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.5)',
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                            '@keyframes float': {
                                '0%': {
                                    transform: 'translateY(0) translateX(0)',
                                    opacity: 0,
                                },
                                '10%': {
                                    opacity: 1,
                                },
                                '90%': {
                                    opacity: 1,
                                },
                                '100%': {
                                    transform: `translateY(-100vh) translateX(${Math.random() * 100 - 50}px)`,
                                    opacity: 0,
                                },
                            },
                        }}
                    />
                ))}
            </Box>

            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 2, sm: 3, md: 4 } }}>
                <Box
                    sx={{
                        textAlign: 'center',
                        mb: { xs: 6, sm: 8, md: 10 },
                        animation: 'fadeInDown 1s ease-out',
                        '@keyframes fadeInDown': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(-30px)',
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)',
                            },
                        },
                    }}
                >
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            fontWeight: 900,
                            mb: 3,
                            background: 'linear-gradient(135deg, #fff 0%, #e0e7ff 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
                            textShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
                            letterSpacing: '-0.03em',
                            lineHeight: 1.1,
                        }}
                    >
                        Lock Rakshak
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            mb: 2,
                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                            fontWeight: 300,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                        }}
                    >
                        Admin Dashboard
                    </Typography>
                    <Box
                        sx={{
                            width: '80px',
                            height: '4px',
                            background: 'linear-gradient(90deg, transparent, #fff, transparent)',
                            margin: '0 auto',
                            borderRadius: '2px',
                        }}
                    />
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            mt: 4,
                            fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.15rem' },
                            fontWeight: 400,
                            maxWidth: '600px',
                            margin: '0 auto',
                            marginTop: '24px',
                        }}
                    >
                        Powerful content management at your fingertips
                    </Typography>
                </Box>

                <Grid
                    container
                    spacing={{ xs: 3, sm: 4, md: 4 }}
                    sx={{
                        justifyContent: 'center',
                    }}
                >
                    {features.map((feature, index) => (
                        <Grid
                            key={index}
                            item
                            size={{
                                xs:12,
                                sm:6,
                                md:4,
                                lg:3
                            }}
                            sx={{
                                display: 'flex',
                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                                '@keyframes fadeInUp': {
                                    '0%': {
                                        opacity: 0,
                                        transform: 'translateY(30px)',
                                    },
                                    '100%': {
                                        opacity: 1,
                                        transform: 'translateY(0)',
                                    },
                                },
                            }}
                        >
                            <Link
                                href={feature.link}
                                style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    width: '100%',
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <Card
                                    sx={{
                                        width: '100%',
                                        height: { xs: '280px', sm: '300px', md: '260px' },
                                        borderRadius: '24px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        boxShadow: hoveredIndex === index
                                            ? `0 20px 60px ${feature.glowColor}, 0 0 40px ${feature.glowColor}`
                                            : '0 8px 32px rgba(0, 0, 0, 0.3)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        transform: hoveredIndex === index ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            background: feature.gradient,
                                            opacity: hoveredIndex === index ? 0.15 : 0,
                                            transition: 'opacity 0.4s ease',
                                            pointerEvents: 'none',
                                        },
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            p: 4,
                                            position: 'relative',
                                        }}
                                    >
                                        <Box>
                                            <Box
                                                sx={{
                                                    width: '72px',
                                                    height: '72px',
                                                    borderRadius: '20px',
                                                    background: feature.gradient,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 3,
                                                    boxShadow: `0 8px 24px ${feature.glowColor}`,
                                                    transform: hoveredIndex === index ? 'rotate(5deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                }}
                                            >
                                                <feature.icon
                                                    sx={{
                                                        fontSize: '36px',
                                                        color: '#ffffff',
                                                    }}
                                                />
                                            </Box>

                                            <Typography
                                                variant="h5"
                                                component="h2"
                                                sx={{
                                                    fontWeight: 700,
                                                    mb: 2,
                                                    color: '#ffffff',
                                                    fontSize: { xs: '1.25rem', sm: '1.35rem', md: '1.5rem' },
                                                    lineHeight: 1.2,
                                                    letterSpacing: '-0.02em',
                                                }}
                                            >
                                                {feature.title}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                lineHeight: 1.6,
                                                fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                                                fontWeight: 400,
                                            }}
                                        >
                                            {feature.description}
                                        </Typography>

                                        {/* Arrow indicator */}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 16,
                                                right: 16,
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: 'rgba(255, 255, 255, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: hoveredIndex === index ? 1 : 0,
                                                transform: hoveredIndex === index ? 'translate(0, 0)' : 'translate(10px, 10px)',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            }}
                                        >
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M7 17L17 7M17 7H7M17 7V17"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}