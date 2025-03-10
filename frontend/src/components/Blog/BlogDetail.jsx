import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Container, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, Paper, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getBlogPost, toggleLike, deleteBlogPost } from '../../services/blogService';
import { pink } from '@mui/material/colors';
import { auth } from '../../firebase.config';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { createApi } from 'unsplash-js';

// Initialize Unsplash API
const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY,
});

// Function to get random image
const getRandomImage = async () => {
  if (!import.meta.env.VITE_UNSPLASH_ACCESS_KEY) {
    return '/assets/blogs.jpg';
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
    return '/assets/blogs.jpg';
  }
};

// Heart icon component
const HeartIcon = ({ filled }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [headerImage, setHeaderImage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await getBlogPost(id);
        setBlog(blogData);
        const imageUrl = await getRandomImage();
        setHeaderImage(imageUrl);
      } catch (error) {
        setError('Failed to fetch blog post');
        console.error(error);
      }
    };
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    try {
      await toggleLike(id);
      setIsLiked(true);
      setBlog(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBlogPost(id);
      navigate('/blogs');
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError('Failed to delete blog post');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const isAuthor = auth.currentUser?.uid === blog.authorId;
  const formatDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header Image */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "300px", sm: "350px", md: "400px" },
          width: "100%",
          overflow: "hidden",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))",
          },
        }}
      >
        {!headerImage ? (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              bgcolor: "rgba(233, 30, 99, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress sx={{ color: pink[300] }} />
          </Box>
        ) : (
          <Box
            component="img"
            src={headerImage}
            alt="Blog header"
            onError={(e) => {
              e.target.src = "/assets/blogs.jpg";
            }}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        <Container
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: "white",
            py: { xs: 4, sm: 5, md: 6 },
          }}
        >
          <IconButton
            onClick={() => navigate("/blogs")}
            sx={{
              color: "white",
              position: "absolute",
              top: { xs: 16, sm: 20, md: 24 },
              left: { xs: 16, sm: 20, md: 24 },
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.2)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              mb: { xs: 1.5, sm: 2 },
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              px: { xs: 2, sm: 0 },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {blog.title}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              px: { xs: 2, sm: 0 },
              alignItems: { xs: "center", sm: "flex-start" },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: { xs: "0.9rem", sm: "1rem" },
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              {formatDate(blog.createdAt)}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: { xs: 1, sm: 0 },
              }}
            >
              <IconButton
                onClick={handleLike}
                disabled={isLiked}
                sx={{
                  color: isLiked ? pink[300] : "white",
                  "&:hover": { color: pink[300] },
                  padding: { xs: 0.5, sm: 1 },
                }}
              >
                <HeartIcon filled={isLiked} />
              </IconButton>
              <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                {blog.likes || 0}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Content */}
      <Container
        maxWidth="md"
        sx={{
          mt: { xs: -4, sm: -5, md: -6 },
          mb: 6,
          position: "relative",
          zIndex: 2,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Paper
          sx={{
            bgcolor: "white",
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            className="blog-content"
            sx={{
              "& img": {
                maxWidth: "100%",
                height: "auto",
                borderRadius: 2,
                my: 2,
              },
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                color: "#2d3436",
                fontWeight: 600,
                lineHeight: 1.3,
                mt: 4,
                mb: 2,
                "&:first-child": {
                  mt: 0,
                },
              },
              "& h1": { fontSize: "2.5rem" },
              "& h2": { fontSize: "2rem" },
              "& h3": { fontSize: "1.75rem" },
              "& h4": { fontSize: "1.5rem" },
              "& h5": { fontSize: "1.25rem" },
              "& h6": { fontSize: "1.1rem" },
              "& p": {
                mb: 2,
                lineHeight: 1.8,
                fontSize: "1.1rem",
                color: "#2d3436",
              },
              "& a": {
                color: pink[500],
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              },
              "& ul, & ol": {
                mb: 2,
                pl: 4,
                "& li": {
                  mb: 1,
                  lineHeight: 1.7,
                },
              },
              "& blockquote": {
                borderLeft: `4px solid ${pink[200]}`,
                m: 0,
                mb: 2,
                pl: 3,
                py: 1,
                bgcolor: pink[50],
                borderRadius: "0 4px 4px 0",
                "& p": {
                  m: 0,
                },
              },
              "& pre": {
                mb: 2,
                borderRadius: 2,
                overflow: "auto",
                bgcolor: "#2d3436",
                color: "#fff",
                p: 2,
              },
              "& code": {
                fontFamily: "monospace",
                p: 0.5,
                borderRadius: 1,
                bgcolor: "#f5f5f5",
                color: pink[700],
                fontSize: "0.9em",
              },
              "& table": {
                width: "100%",
                mb: 2,
                borderCollapse: "collapse",
                "& th, & td": {
                  border: "1px solid #ddd",
                  p: 1.5,
                },
                "& th": {
                  bgcolor: pink[50],
                },
                "& tr:nth-of-type(even)": {
                  bgcolor: "#f8f9fa",
                },
              },
              "& hr": {
                my: 3,
                border: "none",
                borderTop: `1px solid ${pink[100]}`,
              },
              "& p:empty, & p:only-child:not(:has(*))": {
                display: "none",
              },
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {isAuthor && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 6,
                pt: 4,
                borderTop: `1px solid ${pink[100]}`,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate(`/blogs/edit/${id}`)}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  borderColor: pink[500],
                  color: pink[500],
                  "&:hover": {
                    borderColor: pink[700],
                    bgcolor: pink[50],
                  },
                }}
              >
                Edit Blog
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteClick}
                startIcon={<DeleteIcon />}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#ffebee",
                  },
                }}
              >
                Delete Blog
              </Button>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            color: "#2d3436",
          }}
        >
          Delete Blog Post
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this blog post? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              textTransform: "none",
              color: "#636e72",
              "&:hover": {
                bgcolor: "#f8f9fa",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogDetail; 