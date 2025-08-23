import React from 'react'
import Feeds from '@/components/explore/Feeds'

async function getStories() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stories/all?limit=100`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch stories');
    const data = await response.json();
    return data.stories || [];
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

async function getProducts() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/products/all?limit=100`, {
      cache: 'no-store'
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ExplorePage() {
  const [stories, products] = await Promise.all([
    getStories(),
    getProducts()
  ]);

  return (
    <div className='mt-20'>
      <Feeds stories={stories} products={products} />
    </div>
  )
}
