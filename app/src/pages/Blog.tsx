import React, { useEffect, useState, useContext } from 'react';
import { Calendar, Tag, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { blogApi } from '@/services/api';
import type { BlogPost } from '@/types';
import { formatDate } from '@/utils/formatters';
import SEO from '@/components/SEO';
import { RouterContext } from '@/App';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { setCurrentPage, setPageParams } = useContext(RouterContext);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchTags();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogApi.getPosts();
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogApi.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await blogApi.getTags();
      setTags(response.data.slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const handlePostClick = (slug: string) => {
    setPageParams({ slug });
    setCurrentPage('blog-post');
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Global Paycheck Calculator Blog',
    description: 'Articles about taxes, salaries, and personal finance from around the world.',
  };

  return (
    <div className="space-y-8">
      <SEO
        title="Blog - Tax & Salary Insights"
        description="Read articles about taxes, salaries, and personal finance from around the world. Stay informed with our expert insights."
        schema={schema}
      />

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Our Blog</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Insights on taxes, salaries, and personal finance from around the world.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === ''
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading articles...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => handlePostClick(post.slug)}
              className="group text-left"
            >
              <Card className="h-full hover:border-primary hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </div>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary font-medium">
                      {post.category}
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found.</p>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Popular Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Blog;
