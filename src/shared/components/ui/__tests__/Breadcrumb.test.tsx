import React from 'react'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import { Breadcrumb, BreadcrumbItem } from '../Breadcrumb'

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>)
}

describe('Breadcrumb Component', () => {
  const mockItems: BreadcrumbItem[] = [
    { label: 'Admin', path: '/admin' },
    { label: 'Products', path: '/admin/products' },
    { label: 'Edit Product', current: true }
  ]

  describe('Rendering', () => {
    it('should render breadcrumb navigation', () => {
      renderWithRouter(<Breadcrumb items={mockItems} />)
      
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    })

    it('should render home icon link', () => {
      renderWithRouter(<Breadcrumb items={mockItems} />)
      
      const homeLink = screen.getByLabelText('Home')
      expect(homeLink).toBeInTheDocument()
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('should render all breadcrumb items', () => {
      renderWithRouter(<Breadcrumb items={mockItems} />)
      
      expect(screen.getByText('Admin')).toBeInTheDocument()
      expect(screen.getByText('Products')).toBeInTheDocument()
      expect(screen.getByText('Edit Product')).toBeInTheDocument()
    })

    it('should render chevron separators', () => {
      renderWithRouter(<Breadcrumb items={mockItems} />)
      
      // Should have chevrons between home and first item, and between each item
      const chevrons = screen.getAllByRole('img', { hidden: true })
      expect(chevrons.length).toBeGreaterThan(0)
    })
  })

  describe('Links and Current Page', () => {
    it('should render clickable links for non-current items', () => {
      renderWithRouter(<Breadcrumb items={mockItems} />)
      
      const adminLink = screen.getByRole('link', { name: 'Admin' })
      expect(adminLink).toHaveAttribute('href', '/admin')
      
      const productsLink = screen.getByRole('link', { name: 'Products' })
      expect(productsLink).toHaveAttribute('href', '/admin/products')
    })

    it('should render current page as non-clickable text', () => {
      renderWithRouter(<Breadcrumb items={mockItems} />)
      
      const currentPage = screen.getByText('Edit Product')
      expect(currentPage).toHaveAttribute('aria-current', 'page')
      expect(currentPage.tagName).toBe('SPAN')
    })

    it('should handle items without paths as non-clickable', () => {
      const itemsWithoutPath: BreadcrumbItem[] = [
        { label: 'Section' },
        { label: 'Current Page', current: true }
      ]
      
      renderWithRouter(<Breadcrumb items={itemsWithoutPath} />)
      
      const sectionItem = screen.getByText('Section')
      expect(sectionItem.tagName).toBe('SPAN')
      expect(sectionItem).not.toHaveAttribute('href')
    })
  })

  describe('Styling and Accessibility', () => {
    it('should apply custom className', () => {
      const { container } = renderWithRouter(
        <Breadcrumb items={mockItems} className="custom-class" />
      )
      
      const nav = container.querySelector('nav')
      expect(nav).toHaveClass('custom-class')
    })

    it('should have proper ARIA attributes', () => {
      renderWithRouter(<Breadcrumb items={mockItems} />)
      
      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' })
      expect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
      
      const currentPage = screen.getByText('Edit Product')
      expect(currentPage).toHaveAttribute('aria-current', 'page')
    })

    it('should apply hover styles to links', () => {
      renderWithRouter(<Breadcrumb items={mockItems} />)
      
      const adminLink = screen.getByRole('link', { name: 'Admin' })
      expect(adminLink).toHaveClass('hover:text-ocean-600')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      renderWithRouter(<Breadcrumb items={[]} />)
      
      // Should still render home link
      expect(screen.getByLabelText('Home')).toBeInTheDocument()
    })

    it('should handle single item', () => {
      const singleItem: BreadcrumbItem[] = [
        { label: 'Single Page', current: true }
      ]
      
      renderWithRouter(<Breadcrumb items={singleItem} />)
      
      expect(screen.getByText('Single Page')).toBeInTheDocument()
      expect(screen.getByText('Single Page')).toHaveAttribute('aria-current', 'page')
    })

    it('should handle items with special characters', () => {
      const specialItems: BreadcrumbItem[] = [
        { label: 'Admin & Settings', path: '/admin' },
        { label: 'User\'s Profile', current: true }
      ]
      
      renderWithRouter(<Breadcrumb items={specialItems} />)
      
      expect(screen.getByText('Admin & Settings')).toBeInTheDocument()
      expect(screen.getByText('User\'s Profile')).toBeInTheDocument()
    })
  })
})