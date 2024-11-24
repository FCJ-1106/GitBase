'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ArticleEditor() {
  const [article, setArticle] = useState({ title: '', description: '', content: '', path: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const searchParams = useSearchParams();
  const path = searchParams.get('path');

  useEffect(() => {
    if (path) {
      fetchArticle(decodeURIComponent(path));
    } else {
      setError('No article path provided');
      setIsLoading(false);
    }
  }, [path]);

  const fetchArticle = async (articlePath) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/articles?path=${encodeURIComponent(articlePath)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Failed to fetch article. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle({ ...article, [name]: value });
  };

  // 处理粘贴事件
  const handlePaste = useCallback(async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let item of items) {
      if (item.type.indexOf('image') === 0) {
        e.preventDefault();
        setUploadingImage(true);

        try {
          const file = item.getAsFile();
          const formData = new FormData();
          formData.append('image', file);

          // 上传图片到服务器
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to upload image');
          }

          const { imageUrl } = await response.json();

          // 在光标位置插入 Markdown 图片语法
          const textarea = e.target;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const content = article.content;
          const newContent = 
            content.substring(0, start) +
            `![image](${imageUrl})` +
            content.substring(end);

          setArticle(prev => ({
            ...prev,
            content: newContent
          }));

        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Failed to upload image. Please try again.');
        } finally {
          setUploadingImage(false);
        }
      }
    }
  }, [article.content]);

  // 保存文章
  const handleSave = async () => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article }),
      });
      if (!response.ok) {
        throw new Error('Failed to save article');
      }
      alert('Article saved successfully');
    } catch (error) {
      console.error('Error saving article:', error);
      setError('Failed to save article. Please try again.');
    }
  };

  if (isLoading) return <div>Loading article...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <Input
        name="title"
        value={article.title}
        onChange={handleInputChange}
        placeholder="Article Title"
      />
      <Input
        name="description"
        value={article.description}
        onChange={handleInputChange}
        placeholder="Article Description"
      />
      <div className="relative">
        <Textarea
          name="content"
          value={article.content}
          onChange={handleInputChange}
          onPaste={handlePaste}
          placeholder="Article Content (支持粘贴图片)"
          rows={20}
          className="font-mono"
        />
        {uploadingImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="text-sm text-gray-600">Uploading image...</div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={uploadingImage}>
          {uploadingImage ? 'Uploading...' : 'Save Article'}
        </Button>
        <p className="text-sm text-gray-500 mt-2">
          提示：可以直接粘贴图片到编辑器中
        </p>
      </div>
    </div>
  );
}