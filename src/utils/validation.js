// Form validation utilities

export const validators = {
  required: (value) => {
    if (!value || value.toString().trim() === '') {
      return 'This field is required'
    }
    return null
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address'
    }
    return null
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return `Must be at least ${min} characters`
    }
    return null
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters`
    }
    return null
  },

  pattern: (regex, message) => (value) => {
    if (value && !regex.test(value)) {
      return message
    }
    return null
  },

  membershipId: (value) => {
    const membershipRegex = /^LIB-\d{6}$/
    if (!membershipRegex.test(value)) {
      return 'Membership ID must be in format: LIB-123456'
    }
    return null
  },

  futureDate: (value) => {
    const selectedDate = new Date(value)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    if (selectedDate < tomorrow) {
      return 'Date must be at least 24 hours from now'
    }
    return null
  }
}

export const validateField = (value, validationRules) => {
  for (const rule of validationRules) {
    const error = rule(value)
    if (error) {
      return error
    }
  }
  return null
}

export const validateForm = (formData, validationSchema) => {
  const errors = {}
  let isValid = true

  Object.keys(validationSchema).forEach((field) => {
    const error = validateField(formData[field], validationSchema[field])
    if (error) {
      errors[field] = error
      isValid = false
    }
  })

  return { isValid, errors }
}
