import React, { useEffect, useState, useContext } from 'react';
import { Calendar, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { blogApi } from '@/services/api';
import type { BlogPost as BlogPostType } from '@/types';
import { formatDate } from '@/utils/formatters';
import SEO from '@/components/SEO';
import { toast } from 'sonner';
import { RouterContext } from '@/App';

const BlogPost: React.FC = () => {
  const { pageParams, setCurrentPage } = useContext(RouterContext);
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pageParams.slug) {
      fetchPost(pageParams.slug);
    }
  }, []);

  const fetchPost = async (slug: string) => {
    try {
      setLoading(true);
      const response = await blogApi.getPostBySlug(slug);
      setPost(response.data);
      fetchRelatedPosts(slug);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (postSlug: string) => {
    try {
      const response = await blogApi.getRelatedPosts(postSlug);
      setRelatedPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch related posts:', error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Article not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => setCurrentPage('blog')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>
      </div>
    );
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Organization',
      name: 'Global Paycheck Calculator',
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
  };

  return (
    <div className="space-y-8">
      <SEO
        title={post.metaTitle}
        description={post.metaDescription}
        ogImage={post.featuredImage}
        ogType="article"
        schema={schema}
      />

      {/* Back Link */}
      <Button variant="ghost" className="pl-0" onClick={() => setCurrentPage('blog')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog
      </Button>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
        <p className="text-xl text-muted-foreground">{post.excerpt}</p>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="aspect-video overflow-hidden rounded-lg">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <article className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Tag className="h-4 w-4 text-muted-foreground" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedPosts.map((relatedPost) => (
              <button 
                key={relatedPost.id} 
                onClick={() => {
                  setPost(relatedPost);
                  window.scrollTo(0, 0);
                }}
              >
                <Card className="h-full hover:border-primary hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatDate(relatedPost.publishedAt || relatedPost.createdAt)}
                    </p>
                    <h3 className="font-semibold line-clamp-2">{relatedPost.title}</h3>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
