import React, { useState, useEffect, memo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Container,
  Skeleton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { subscribeToBlogPosts } from '../../services/blogService';
import { pink } from '@mui/material/colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { createApi } from 'unsplash-js';
import { stripHtml, truncateText } from '../../utils/textUtils';

// Initialize Unsplash API with environment variable
const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
});

// Fallback images array
const fallbackImages = [
  '/assets/photo1.jpg',
  '/assets/photo2.jpg',
  '/assets/photo3.jpg',
  '/assets/photo4.jpg',
];

// Function to get random fallback image
const getRandomFallbackImage = () => {
  const randomIndex = Math.floor(Math.random() * fallbackImages.length);
  return fallbackImages[randomIndex];
};

// Function to get random image with error handling
const getRandomImage = async () => {
  if (!import.meta.env.VITE_UNSPLASH_ACCESS_KEY) {
    return getRandomFallbackImage();
  }

  try {
    const result = await unsplash.photos.getRandom({
      query: 'business technology',
      orientation: 'landscape',
    });
    
    if (!result.response?.urls?.regular) {
      throw new Error('No image URL in response');
    }
    
    return result.response.urls.regular;
  } catch (error) {
    console.warn('Failed to fetch Unsplash image:', error);
    return getRandomFallbackImage();
  }
};

// Memoized BlogCard component to prevent unnecessary re-renders
const BlogCard = memo(({ blog, image, isLoading, onClick }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Skeleton
          variant="rectangular"
          height={180}
          animation="wave"
          sx={{ bgcolor: 'rgba(233, 30, 99, 0.1)' }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
          <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="60%" height={16} />
          <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="20%" />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: 3,
        overflow: 'hidden',
        transform: 'translateZ(0)', // Force GPU acceleration
        willChange: 'transform', // Optimize animations
        '&:hover': { 
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        },
        transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height={180}
        image={image}
        alt={blog.title}
        sx={{ 
          objectFit: 'cover',
          bgcolor: 'rgba(233, 30, 99, 0.1)',
        }}
      />
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        p: 2.5,
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 1.5,
            fontWeight: 600,
            fontSize: '1.1rem',
            lineHeight: 1.4,
            color: '#2d3436',
          }}
        >
          {blog.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            color: '#636e72',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            fontSize: '0.875rem',
            lineHeight: 1.6,
          }}
        >
          {truncateText(stripHtml(blog.content), 200)}
        </Typography>
        <Box sx={{ 
          mt: 'auto', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 1.5,
          borderTop: 1,
          borderColor: 'rgba(0,0,0,0.05)'
        }}>
          <Typography variant="caption" sx={{ color: '#636e72' }}>
            {formatDate(blog.createdAt)}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: pink[500]
          }}>
            <FavoriteIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              {blog.likes || 0}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogImages, setBlogImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeoutError, setTimeoutError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;
    setIsLoading(true);
    setTimeoutError(false);

    // Set timeout for 15 seconds
    timeoutId = setTimeout(() => {
      if (blogs.length === 0) {
        setTimeoutError(true);
        setIsLoading(false);
      }
    }, 15000);

    const unsubscribe = subscribeToBlogPosts((newBlogs) => {
      setBlogs(newBlogs);
      setIsLoading(false);
      clearTimeout(timeoutId);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const newImages = {};
        await Promise.all(
          blogs.map(async (blog) => {
            if (!blogImages[blog.id]) {
              const imageUrl = await getRandomImage();
              newImages[blog.id] = imageUrl;
            }
          })
        );
        setBlogImages(prev => ({ ...prev, ...newImages }));
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    if (blogs.length > 0) {
      loadImages();
    }
  }, [blogs]);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f8f9fa',
    }}>
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 5,
          gap: 2,
          bgcolor: 'white',
          p: 3,
          borderRadius: 4,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
        }}>
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ 
              color: pink[500],
              '&:hover': { 
                bgcolor: pink[50],
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              flex: 1,
              background: `linear-gradient(45deg, ${pink[700]}, ${pink[500]})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Explore Blogs
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/blogs/create')}
            sx={{
              bgcolor: pink[500],
              '&:hover': { 
                bgcolor: pink[700],
                transform: 'translateY(-2px)'
              },
              textTransform: 'none',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(233, 30, 99, 0.2)',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Write a Blog
          </Button>
        </Box>

        {isLoading ? (
          <Grid container spacing={3}>
            {Array(3).fill(null).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <BlogCard isLoading={true} />
              </Grid>
            ))}
          </Grid>
        ) : timeoutError ? (
          <Box sx={{ 
            textAlign: 'center', 
            mt: 8, 
            p: 6, 
            bgcolor: 'white',
            borderRadius: 4,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h5" sx={{ color: pink[700], fontWeight: 600, mb: 2 }}>
              Unable to fetch blogs
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              There might be a connection issue. Please try again later.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{
                color: pink[500],
                borderColor: pink[200],
                '&:hover': { borderColor: pink[500], bgcolor: pink[50] }
              }}
            >
              Refresh Page
            </Button>
          </Box>
        ) : blogs.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            mt: 8, 
            p: 6, 
            bgcolor: 'white',
            borderRadius: 4,
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
          }}>
            <Typography variant="h5" sx={{ color: pink[700], fontWeight: 600, mb: 2 }}>
              No blogs available yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Be the first one to write a blog!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {blogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={blog.id}>
                <BlogCard
                  blog={blog}
                  image={blogImages[blog.id]}
                  isLoading={false}
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default BlogList; 