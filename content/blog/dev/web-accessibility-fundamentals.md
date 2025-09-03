---
title: 'Web Accessibility Fundamentals: Building Inclusive Applications'
date: '2024-04-20'
description: 'Comprehensive guide to web accessibility covering WCAG guidelines, semantic HTML, ARIA attributes, keyboard navigation, and testing strategies for inclusive web applications.'
category: 'dev'
tags: ['accessibility', 'a11y', 'frontend', 'html', 'javascript', 'design']
author: 'Allie'
published: false
featured: true
featured_image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=600&fit=crop'
reading_time: '15 min'
slug: 'web-accessibility-fundamentals'
---

# Web Accessibility Fundamentals: Building Inclusive Applications

Web accessibility isn't just about compliance—it's about creating inclusive experiences that work for everyone. Let's explore practical strategies for building accessible web applications that provide equal access to information and functionality.

## Understanding Accessibility Principles

### The Four Principles of WCAG

Web Content Accessibility Guidelines (WCAG) are built around four core principles: **Perceivable**, **Operable**, **Understandable**, and **Robust** (POUR).

```javascript
// Accessibility audit checklist based on POUR principles
const accessibilityAudit = {
  perceivable: {
    textAlternatives: {
      description: 'All non-text content has text alternatives',
      checks: [
        'Images have meaningful alt text',
        'Complex images have extended descriptions',
        'Decorative images have empty alt attributes',
        'Form controls have labels',
        'Audio/video content has captions',
      ],
    },
    colorContrast: {
      description: 'Sufficient color contrast for readability',
      minimumRatio: {
        normal: 4.5,
        large: 3,
        graphicalObjects: 3,
      },
    },
    resizableText: {
      description: 'Text can be resized up to 200% without loss of functionality',
      implementation: 'Use relative units (rem, em) instead of fixed pixels',
    },
  },

  operable: {
    keyboardNavigation: {
      description: 'All functionality available from keyboard',
      requirements: [
        'Tab order is logical and visible',
        'Focus indicators are clearly visible',
        'No keyboard traps',
        'Bypass mechanisms for repetitive content',
      ],
    },
    timing: {
      description: 'Users have enough time to read content',
      considerations: [
        'Provide option to extend time limits',
        'Allow users to pause/stop moving content',
        'Avoid content that flashes more than 3 times per second',
      ],
    },
  },

  understandable: {
    readability: {
      description: 'Text content is readable and understandable',
      guidelines: [
        'Use clear, simple language',
        'Define abbreviations and jargon',
        'Provide pronunciation guides for complex terms',
      ],
    },
    predictability: {
      description: 'Web pages work in predictable ways',
      implementation: [
        'Navigation is consistent across pages',
        'Context changes are initiated by user request',
        'Help and error messages are consistent',
      ],
    },
  },

  robust: {
    compatibility: {
      description: 'Content works with various assistive technologies',
      requirements: [
        'Valid HTML markup',
        'Proper use of semantic elements',
        'Correct implementation of ARIA attributes',
      ],
    },
  },
}
```

## Semantic HTML Foundation

### Using HTML Elements Correctly

```html
<!-- ❌ Poor semantic structure -->
<div class="header">
  <div class="nav">
    <div class="nav-item"><a href="/">Home</a></div>
    <div class="nav-item"><a href="/about">About</a></div>
  </div>
</div>
<div class="content">
  <div class="article">
    <div class="title">Article Title</div>
    <div class="text">Article content...</div>
  </div>
</div>

<!-- ✅ Proper semantic structure -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>
</main>
```

### Form Accessibility

```html
<!-- Accessible form with proper labeling and structure -->
<form novalidate>
  <fieldset>
    <legend>Personal Information</legend>

    <!-- Text input with label -->
    <div class="form-group">
      <label for="fullName"> Full Name <span aria-label="required">*</span> </label>
      <input
        type="text"
        id="fullName"
        name="fullName"
        required
        aria-describedby="fullName-error fullName-help"
        aria-invalid="false"
      />
      <div id="fullName-help" class="form-help">Enter your first and last name</div>
      <div id="fullName-error" class="form-error" role="alert" aria-live="polite">
        <!-- Error message will be inserted here -->
      </div>
    </div>

    <!-- Email input with validation -->
    <div class="form-group">
      <label for="email"> Email Address <span aria-label="required">*</span> </label>
      <input
        type="email"
        id="email"
        name="email"
        required
        autocomplete="email"
        aria-describedby="email-error email-help"
      />
      <div id="email-help" class="form-help">We'll use this to send you important updates</div>
      <div id="email-error" class="form-error" role="alert" aria-live="polite"></div>
    </div>

    <!-- Radio button group -->
    <fieldset class="form-group">
      <legend>Preferred Contact Method</legend>
      <div class="radio-group">
        <input type="radio" id="contact-email" name="contactMethod" value="email" />
        <label for="contact-email">Email</label>
      </div>
      <div class="radio-group">
        <input type="radio" id="contact-phone" name="contactMethod" value="phone" />
        <label for="contact-phone">Phone</label>
      </div>
    </fieldset>

    <!-- Checkbox with additional context -->
    <div class="form-group">
      <input
        type="checkbox"
        id="newsletter"
        name="newsletter"
        aria-describedby="newsletter-description"
      />
      <label for="newsletter">Subscribe to newsletter</label>
      <div id="newsletter-description" class="form-help">
        Receive monthly updates about new features and articles
      </div>
    </div>
  </fieldset>

  <button type="submit" class="submit-button">Submit Application</button>
</form>
```

### Accessible Form Validation

```javascript
// Accessible form validation with proper error handling
class AccessibleFormValidator {
  constructor(form) {
    this.form = form
    this.errors = new Map()
    this.setupEventListeners()
  }

  setupEventListeners() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this))

    // Real-time validation on blur
    this.form.addEventListener(
      'blur',
      e => {
        if (e.target.matches('input, select, textarea')) {
          this.validateField(e.target)
        }
      },
      true
    )

    // Clear errors on focus
    this.form.addEventListener(
      'focus',
      e => {
        if (e.target.matches('input, select, textarea')) {
          this.clearFieldError(e.target)
        }
      },
      true
    )
  }

  handleSubmit(e) {
    e.preventDefault()

    const isValid = this.validateForm()

    if (isValid) {
      this.submitForm()
    } else {
      // Focus the first field with an error
      this.focusFirstError()
    }
  }

  validateForm() {
    let isValid = true
    const fields = this.form.querySelectorAll('input, select, textarea')

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false
      }
    })

    return isValid
  }

  validateField(field) {
    const validators = {
      required: value => value.trim() !== '',
      email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      minLength: (value, min) => value.length >= min,
      pattern: (value, pattern) => new RegExp(pattern).test(value),
    }

    let isValid = true
    let errorMessage = ''

    // Required validation
    if (field.hasAttribute('required') && !validators.required(field.value)) {
      isValid = false
      errorMessage = `${this.getFieldLabel(field)} is required`
    }

    // Type-specific validation
    if (isValid && field.value) {
      switch (field.type) {
        case 'email':
          if (!validators.email(field.value)) {
            isValid = false
            errorMessage = 'Please enter a valid email address'
          }
          break

        case 'password':
          const minLength = field.getAttribute('minlength')
          if (minLength && !validators.minLength(field.value, parseInt(minLength))) {
            isValid = false
            errorMessage = `Password must be at least ${minLength} characters long`
          }
          break
      }
    }

    // Custom pattern validation
    const pattern = field.getAttribute('pattern')
    if (isValid && pattern && field.value && !validators.pattern(field.value, pattern)) {
      isValid = false
      errorMessage = field.getAttribute('data-pattern-error') || 'Please match the requested format'
    }

    if (isValid) {
      this.clearFieldError(field)
    } else {
      this.showFieldError(field, errorMessage)
    }

    return isValid
  }

  showFieldError(field, message) {
    const errorId = `${field.id}-error`
    const errorElement = document.getElementById(errorId)

    if (errorElement) {
      errorElement.textContent = message
      errorElement.style.display = 'block'
    }

    field.setAttribute('aria-invalid', 'true')
    field.classList.add('error')

    this.errors.set(field.id, message)
  }

  clearFieldError(field) {
    const errorId = `${field.id}-error`
    const errorElement = document.getElementById(errorId)

    if (errorElement) {
      errorElement.textContent = ''
      errorElement.style.display = 'none'
    }

    field.setAttribute('aria-invalid', 'false')
    field.classList.remove('error')

    this.errors.delete(field.id)
  }

  getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`)
    return label ? label.textContent.replace(/\s*\*\s*/, '') : field.name
  }

  focusFirstError() {
    const firstErrorField = this.form.querySelector('.error')
    if (firstErrorField) {
      firstErrorField.focus()

      // Announce the error count to screen readers
      const errorCount = this.errors.size
      this.announceToScreenReader(
        `Form contains ${errorCount} error${errorCount !== 1 ? 's' : ''}. Please review and correct.`
      )
    }
  }

  announceToScreenReader(message) {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'assertive')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  async submitForm() {
    try {
      const formData = new FormData(this.form)
      const response = await fetch(this.form.action || '/submit', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        this.announceToScreenReader('Form submitted successfully!')
        // Handle success (redirect, show message, etc.)
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      this.announceToScreenReader('Form submission failed. Please try again.')
    }
  }
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form[data-validate]')
  forms.forEach(form => new AccessibleFormValidator(form))
})
```

## ARIA Attributes and Roles

### Custom Interactive Components

```javascript
// Accessible dropdown/combobox component
class AccessibleCombobox {
  constructor(element) {
    this.combobox = element
    this.input = element.querySelector('[role="combobox"]')
    this.listbox = element.querySelector('[role="listbox"]')
    this.options = Array.from(element.querySelectorAll('[role="option"]'))

    this.isExpanded = false
    this.activeIndex = -1
    this.selectedIndex = -1

    this.setupARIA()
    this.setupEventListeners()
  }

  setupARIA() {
    const listboxId = this.listbox.id || `listbox-${Date.now()}`
    this.listbox.id = listboxId

    this.input.setAttribute('aria-controls', listboxId)
    this.input.setAttribute('aria-expanded', 'false')
    this.input.setAttribute('aria-autocomplete', 'list')
    this.input.setAttribute('role', 'combobox')

    this.options.forEach((option, index) => {
      option.setAttribute('aria-selected', 'false')
      option.id = option.id || `option-${index}`
    })

    this.listbox.setAttribute('aria-hidden', 'true')
  }

  setupEventListeners() {
    // Input events
    this.input.addEventListener('input', this.handleInput.bind(this))
    this.input.addEventListener('keydown', this.handleKeyDown.bind(this))
    this.input.addEventListener('focus', this.handleFocus.bind(this))
    this.input.addEventListener('blur', this.handleBlur.bind(this))

    // Option click events
    this.options.forEach((option, index) => {
      option.addEventListener('click', () => this.selectOption(index))
      option.addEventListener('mouseenter', () => this.setActiveOption(index))
    })

    // Click outside to close
    document.addEventListener('click', e => {
      if (!this.combobox.contains(e.target)) {
        this.collapse()
      }
    })
  }

  handleInput(e) {
    const value = e.target.value
    this.filterOptions(value)

    if (!this.isExpanded) {
      this.expand()
    }
  }

  handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!this.isExpanded) {
          this.expand()
        } else {
          this.moveActiveOption(1)
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        if (this.isExpanded) {
          this.moveActiveOption(-1)
        }
        break

      case 'Enter':
        e.preventDefault()
        if (this.isExpanded && this.activeIndex >= 0) {
          this.selectOption(this.activeIndex)
        }
        break

      case 'Escape':
        e.preventDefault()
        this.collapse()
        break

      case 'Tab':
        this.collapse()
        break
    }
  }

  handleFocus() {
    // Show all options on focus if input is empty
    if (!this.input.value) {
      this.showAllOptions()
      this.expand()
    }
  }

  handleBlur(e) {
    // Delay collapse to allow option clicks
    setTimeout(() => {
      if (!this.combobox.contains(document.activeElement)) {
        this.collapse()
      }
    }, 150)
  }

  filterOptions(value) {
    const filteredOptions = this.options.filter(option =>
      option.textContent.toLowerCase().includes(value.toLowerCase())
    )

    this.options.forEach(option => {
      const matches = filteredOptions.includes(option)
      option.style.display = matches ? 'block' : 'none'
      option.setAttribute('aria-hidden', matches ? 'false' : 'true')
    })

    // Reset active index after filtering
    this.activeIndex = -1
    this.clearActiveOption()
  }

  showAllOptions() {
    this.options.forEach(option => {
      option.style.display = 'block'
      option.setAttribute('aria-hidden', 'false')
    })
  }

  expand() {
    this.isExpanded = true
    this.input.setAttribute('aria-expanded', 'true')
    this.listbox.setAttribute('aria-hidden', 'false')
    this.listbox.style.display = 'block'
  }

  collapse() {
    this.isExpanded = false
    this.input.setAttribute('aria-expanded', 'false')
    this.listbox.setAttribute('aria-hidden', 'true')
    this.listbox.style.display = 'none'
    this.activeIndex = -1
    this.clearActiveOption()
  }

  moveActiveOption(direction) {
    const visibleOptions = this.options.filter(option => option.style.display !== 'none')

    if (visibleOptions.length === 0) return

    let newIndex = this.activeIndex + direction

    if (newIndex < 0) {
      newIndex = visibleOptions.length - 1
    } else if (newIndex >= visibleOptions.length) {
      newIndex = 0
    }

    const globalIndex = this.options.indexOf(visibleOptions[newIndex])
    this.setActiveOption(globalIndex)
  }

  setActiveOption(index) {
    this.clearActiveOption()

    if (index >= 0 && index < this.options.length) {
      this.activeIndex = index
      const option = this.options[index]
      option.setAttribute('aria-selected', 'true')
      option.classList.add('active')

      this.input.setAttribute('aria-activedescendant', option.id)

      // Scroll option into view
      option.scrollIntoView({ block: 'nearest' })
    }
  }

  clearActiveOption() {
    this.options.forEach(option => {
      option.setAttribute('aria-selected', 'false')
      option.classList.remove('active')
    })
    this.input.removeAttribute('aria-activedescendant')
  }

  selectOption(index) {
    const option = this.options[index]
    if (option) {
      this.input.value = option.textContent
      this.selectedIndex = index
      this.collapse()

      // Trigger change event
      const changeEvent = new Event('change', { bubbles: true })
      this.input.dispatchEvent(changeEvent)

      // Announce selection to screen readers
      this.announceSelection(option.textContent)
    }
  }

  announceSelection(text) {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = `Selected: ${text}`

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }
}

// Initialize all comboboxes
document.addEventListener('DOMContentLoaded', () => {
  const comboboxes = document.querySelectorAll('[data-combobox]')
  comboboxes.forEach(element => new AccessibleCombobox(element))
})
```

### Modal Dialog Accessibility

```javascript
// Accessible modal dialog with focus management
class AccessibleModal {
  constructor(modalElement) {
    this.modal = modalElement
    this.overlay = modalElement.querySelector('.modal-overlay')
    this.content = modalElement.querySelector('.modal-content')
    this.closeButton = modalElement.querySelector('.modal-close')

    this.previousFocus = null
    this.focusableElements = []
    this.firstFocusableElement = null
    this.lastFocusableElement = null

    this.setupARIA()
    this.setupEventListeners()
  }

  setupARIA() {
    this.modal.setAttribute('role', 'dialog')
    this.modal.setAttribute('aria-modal', 'true')
    this.modal.setAttribute('aria-hidden', 'true')

    // Ensure modal has accessible name
    if (!this.modal.hasAttribute('aria-labelledby') && !this.modal.hasAttribute('aria-label')) {
      const heading = this.content.querySelector('h1, h2, h3, h4, h5, h6')
      if (heading && !heading.id) {
        heading.id = `modal-title-${Date.now()}`
      }
      if (heading) {
        this.modal.setAttribute('aria-labelledby', heading.id)
      }
    }
  }

  setupEventListeners() {
    // Close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', () => this.close())
    }

    // Overlay click to close
    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) {
        this.close()
      }
    })

    // Keyboard events
    this.modal.addEventListener('keydown', this.handleKeyDown.bind(this))
  }

  handleKeyDown(e) {
    switch (e.key) {
      case 'Escape':
        this.close()
        break

      case 'Tab':
        this.handleTabKey(e)
        break
    }
  }

  handleTabKey(e) {
    if (this.focusableElements.length === 0) return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusableElement) {
        e.preventDefault()
        this.lastFocusableElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusableElement) {
        e.preventDefault()
        this.firstFocusableElement.focus()
      }
    }
  }

  open() {
    // Store reference to previously focused element
    this.previousFocus = document.activeElement

    // Show modal
    this.modal.style.display = 'block'
    this.modal.setAttribute('aria-hidden', 'false')

    // Update focusable elements
    this.updateFocusableElements()

    // Focus the first focusable element or the modal itself
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus()
    } else {
      this.modal.focus()
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden'

    // Announce modal opening to screen readers
    this.announceToScreenReader('Dialog opened')

    // Trap focus within modal
    document.addEventListener('focusin', this.handleFocusIn.bind(this))
  }

  close() {
    // Hide modal
    this.modal.style.display = 'none'
    this.modal.setAttribute('aria-hidden', 'true')

    // Restore body scroll
    document.body.style.overflow = ''

    // Return focus to previous element
    if (this.previousFocus && this.previousFocus.focus) {
      this.previousFocus.focus()
    }

    // Remove focus trap
    document.removeEventListener('focusin', this.handleFocusIn.bind(this))

    // Announce modal closing
    this.announceToScreenReader('Dialog closed')
  }

  handleFocusIn(e) {
    // If focus moves outside modal, redirect it back
    if (!this.modal.contains(e.target)) {
      e.preventDefault()
      if (this.firstFocusableElement) {
        this.firstFocusableElement.focus()
      } else {
        this.modal.focus()
      }
    }
  }

  updateFocusableElements() {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ')

    this.focusableElements = Array.from(this.modal.querySelectorAll(focusableSelectors)).filter(
      element => {
        return (
          element.offsetWidth > 0 && element.offsetHeight > 0 && !element.hasAttribute('hidden')
        )
      }
    )

    this.firstFocusableElement = this.focusableElements[0] || null
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] || null
  }

  announceToScreenReader(message) {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement)
      }
    }, 1000)
  }
}

// Modal trigger setup
document.addEventListener('DOMContentLoaded', () => {
  const modals = new Map()

  // Initialize modals
  document.querySelectorAll('[data-modal]').forEach(modal => {
    modals.set(modal.id, new AccessibleModal(modal))
  })

  // Setup modal triggers
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-modal-open]')
    if (trigger) {
      const modalId = trigger.getAttribute('data-modal-open')
      const modal = modals.get(modalId)
      if (modal) {
        modal.open()
      }
    }
  })
})
```

## Keyboard Navigation

### Focus Management

```css
/* Visible focus indicators */
:focus {
  outline: 3px solid #4a90e2;
  outline-offset: 2px;
}

/* Custom focus styles for different elements */
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 3px solid #4a90e2;
  outline-offset: 2px;
  box-shadow: 0 0 0 1px rgba(74, 144, 226, 0.3);
}

/* High contrast focus for dark backgrounds */
.dark-theme :focus {
  outline-color: #87ceeb;
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}

/* Focus within for composite widgets */
.card:focus-within {
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.5);
}

/* Remove focus from non-interactive elements unless they have tabindex */
h1,
h2,
h3,
h4,
h5,
h6,
p,
div:not([tabindex]) {
  outline: none;
}
```

### Keyboard Navigation Patterns

```javascript
// Arrow key navigation for grid layouts
class KeyboardGridNavigator {
  constructor(grid) {
    this.grid = grid
    this.items = Array.from(grid.querySelectorAll('[data-grid-item]'))
    this.columns = parseInt(grid.getAttribute('data-columns')) || 1
    this.currentIndex = 0

    this.setupKeyboardNavigation()
  }

  setupKeyboardNavigation() {
    this.items.forEach((item, index) => {
      item.setAttribute('tabindex', index === 0 ? '0' : '-1')
      item.addEventListener('keydown', this.handleKeyDown.bind(this))
      item.addEventListener('focus', () => {
        this.currentIndex = index
      })
    })
  }

  handleKeyDown(e) {
    let newIndex = this.currentIndex

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        newIndex = this.getNextIndex('right')
        break

      case 'ArrowLeft':
        e.preventDefault()
        newIndex = this.getNextIndex('left')
        break

      case 'ArrowDown':
        e.preventDefault()
        newIndex = this.getNextIndex('down')
        break

      case 'ArrowUp':
        e.preventDefault()
        newIndex = this.getNextIndex('up')
        break

      case 'Home':
        e.preventDefault()
        newIndex = 0
        break

      case 'End':
        e.preventDefault()
        newIndex = this.items.length - 1
        break

      case 'PageDown':
        e.preventDefault()
        newIndex = Math.min(this.currentIndex + this.columns * 5, this.items.length - 1)
        break

      case 'PageUp':
        e.preventDefault()
        newIndex = Math.max(this.currentIndex - this.columns * 5, 0)
        break

      default:
        return // Don't prevent default for other keys
    }

    if (newIndex !== this.currentIndex) {
      this.moveTo(newIndex)
    }
  }

  getNextIndex(direction) {
    const row = Math.floor(this.currentIndex / this.columns)
    const col = this.currentIndex % this.columns
    let newIndex = this.currentIndex

    switch (direction) {
      case 'right':
        if (col < this.columns - 1 && this.currentIndex + 1 < this.items.length) {
          newIndex = this.currentIndex + 1
        } else {
          // Wrap to next row
          newIndex =
            row * this.columns + this.columns < this.items.length
              ? row * this.columns + this.columns
              : this.currentIndex
        }
        break

      case 'left':
        if (col > 0) {
          newIndex = this.currentIndex - 1
        } else {
          // Wrap to previous row
          newIndex =
            row > 0
              ? Math.min((row - 1) * this.columns + this.columns - 1, this.items.length - 1)
              : this.currentIndex
        }
        break

      case 'down':
        newIndex = Math.min(this.currentIndex + this.columns, this.items.length - 1)
        break

      case 'up':
        newIndex = Math.max(this.currentIndex - this.columns, 0)
        break
    }

    return newIndex
  }

  moveTo(index) {
    // Update tabindex
    this.items[this.currentIndex].setAttribute('tabindex', '-1')
    this.items[index].setAttribute('tabindex', '0')

    // Focus new item
    this.items[index].focus()

    this.currentIndex = index
  }
}

// Initialize grid navigators
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-keyboard-grid]').forEach(grid => {
    new KeyboardGridNavigator(grid)
  })
})
```

## Color and Visual Design

### Color Contrast and Design

```css
/* Color system with accessibility in mind */
:root {
  /* Primary colors with sufficient contrast */
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-primary-light: #3b82f6;

  /* Text colors */
  --color-text-primary: #1f2937; /* 16.97:1 on white */
  --color-text-secondary: #4b5563; /* 8.59:1 on white */
  --color-text-muted: #6b7280; /* 5.74:1 on white */

  /* Background colors */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-muted: #f3f4f6;

  /* State colors */
  --color-success: #059669; /* 4.52:1 on white */
  --color-warning: #d97706; /* 4.52:1 on white */
  --color-error: #dc2626; /* 5.74:1 on white */
  --color-info: #2563eb; /* 4.56:1 on white */

  /* Focus and interaction */
  --color-focus: #4f46e5;
  --color-focus-ring: rgba(79, 70, 229, 0.3);
}

/* Dark theme with maintained contrast ratios */
[data-theme='dark'] {
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d1d5db;
  --color-text-muted: #9ca3af;

  --color-bg-primary: #111827;
  --color-bg-secondary: #1f2937;
  --color-bg-muted: #374151;

  --color-focus: #a78bfa;
  --color-focus-ring: rgba(167, 139, 250, 0.3);
}

/* Ensure sufficient contrast for all text */
.text-primary {
  color: var(--color-text-primary);
}
.text-secondary {
  color: var(--color-text-secondary);
}
.text-muted {
  color: var(--color-text-muted);
}

/* State indicators that don't rely solely on color */
.status-success {
  color: var(--color-success);
}
.status-success::before {
  content: '✓ ';
  font-weight: bold;
}

.status-warning {
  color: var(--color-warning);
}
.status-warning::before {
  content: '⚠ ';
  font-weight: bold;
}

.status-error {
  color: var(--color-error);
}
.status-error::before {
  content: '✕ ';
  font-weight: bold;
}

/* Focus indicators that work in all themes */
.custom-focus:focus {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
  box-shadow: 0 0 0 1px var(--color-focus-ring);
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --color-text-primary: #000000;
    --color-text-secondary: #000000;
    --color-bg-primary: #ffffff;
    --color-focus: #000000;
  }

  [data-theme='dark'] {
    --color-text-primary: #ffffff;
    --color-text-secondary: #ffffff;
    --color-bg-primary: #000000;
    --color-focus: #ffffff;
  }

  button,
  input,
  select,
  textarea {
    border: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing and Validation

### Automated Accessibility Testing

```javascript
// Accessibility testing with axe-core
const axeConfig = {
  rules: {
    'color-contrast': { enabled: true },
    keyboard: { enabled: true },
    wcag2a: { enabled: true },
    wcag2aa: { enabled: true },
    wcag21aa: { enabled: true },
  },
}

// Automated testing function
async function runAccessibilityTests() {
  try {
    const results = await axe.run(document, axeConfig)

    if (results.violations.length > 0) {
      console.group('Accessibility Violations Found')

      results.violations.forEach(violation => {
        console.group(`${violation.impact}: ${violation.description}`)
        console.log('Help:', violation.helpUrl)

        violation.nodes.forEach(node => {
          console.log('Element:', node.target)
          console.log('HTML:', node.html)
          if (node.failureSummary) {
            console.log('Issue:', node.failureSummary)
          }
        })

        console.groupEnd()
      })

      console.groupEnd()
    } else {
      console.log('✅ No accessibility violations found!')
    }

    return results
  } catch (error) {
    console.error('Accessibility testing failed:', error)
  }
}

// Manual keyboard testing helper
class KeyboardTester {
  constructor() {
    this.focusableElements = []
    this.currentIndex = 0
    this.setupTesting()
  }

  setupTesting() {
    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.altKey && e.key === 't') {
        this.startTest()
      }
    })
  }

  startTest() {
    console.log('Starting keyboard navigation test...')
    this.findFocusableElements()
    this.testTabOrder()
  }

  findFocusableElements() {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    this.focusableElements = Array.from(document.querySelectorAll(selector)).filter(el =>
      this.isVisible(el)
    )

    console.log(`Found ${this.focusableElements.length} focusable elements`)
  }

  isVisible(element) {
    const style = window.getComputedStyle(element)
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    )
  }

  testTabOrder() {
    console.log('Testing tab order...')

    this.focusableElements.forEach((element, index) => {
      setTimeout(() => {
        element.focus()
        element.style.outline = '3px solid red'

        console.log(`${index + 1}. ${element.tagName}`, {
          id: element.id,
          className: element.className,
          tabIndex: element.tabIndex,
          accessibleName: this.getAccessibleName(element),
        })

        // Remove outline after a moment
        setTimeout(() => {
          element.style.outline = ''
        }, 1000)
      }, index * 1500)
    })
  }

  getAccessibleName(element) {
    // Simple accessible name calculation
    if (element.hasAttribute('aria-label')) {
      return element.getAttribute('aria-label')
    }

    if (element.hasAttribute('aria-labelledby')) {
      const labelIds = element.getAttribute('aria-labelledby').split(' ')
      return labelIds
        .map(id => {
          const labelElement = document.getElementById(id)
          return labelElement ? labelElement.textContent : ''
        })
        .join(' ')
    }

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      const label = document.querySelector(`label[for="${element.id}"]`)
      if (label) return label.textContent
    }

    return element.textContent || element.alt || element.title || '[No accessible name]'
  }
}

// Initialize testing tools in development
if (process.env.NODE_ENV === 'development') {
  document.addEventListener('DOMContentLoaded', () => {
    new KeyboardTester()

    // Run automated tests after page load
    setTimeout(runAccessibilityTests, 1000)
  })
}
```

## Conclusion

Web accessibility is not an add-on feature—it's a fundamental aspect of good web development. By following these practices, you create applications that work for everyone:

**Key Takeaways:**

1. **Start with semantic HTML** - Proper markup provides the foundation for accessibility
2. **Design with contrast and clarity** - Ensure your visual design is perceivable by all users
3. **Implement proper keyboard navigation** - Not everyone uses a mouse
4. **Use ARIA thoughtfully** - Enhance semantics where HTML falls short, but don't overuse
5. **Test regularly** - Use both automated tools and manual testing
6. **Consider the full user journey** - Accessibility affects every interaction

**Remember:**

- Accessibility benefits everyone, not just users with disabilities
- Many accessibility features improve the general user experience
- It's more cost-effective to build accessibility in from the start
- Legal compliance is important, but creating inclusive experiences is the real goal

The web is for everyone. By making accessibility a priority in your development process, you ensure that your applications truly serve all users, regardless of their abilities or how they interact with technology.

Building accessible applications is an ongoing journey of learning and improvement. Start with the basics, test regularly, and always keep your users' diverse needs in mind.
