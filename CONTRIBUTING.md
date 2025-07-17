# Contributing to TigrayTutor

Thank you for your interest in contributing to TigrayTutor! We welcome contributions from developers, educators, linguists, and community members who want to help improve education for Tigrinya-speaking students.

## 🌟 Ways to Contribute

### 🔧 Code Contributions

- Bug fixes and improvements
- New features and enhancements
- Performance optimizations
- UI/UX improvements
- Documentation updates

### 🌍 Language & Content

- Tigrinya language improvements
- Educational content creation
- Curriculum alignment suggestions
- Cultural context enhancements

### 🧪 Testing & Feedback

- Bug reporting
- Feature testing
- User experience feedback
- Performance testing

### 📚 Documentation

- Code documentation
- User guides
- API documentation
- Translation of docs

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- Git
- Basic knowledge of React/Next.js
- Understanding of Tigrinya language (for content contributions)

### Development Setup

1. **Fork the repository**

   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/tigray-tutor-ai.git
   cd tigray-tutor-ai
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Add your API keys (see README.md for details)
   ```

5. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

6. **Start development server**

   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the existing ESLint configuration
- **Prettier**: Code formatting is handled automatically
- **Naming**: Use descriptive variable and function names
- **Comments**: Add comments for complex logic, especially in Tigrinya

### Component Structure

```typescript
// components/ExampleComponent.tsx
'use client';
import React from 'react';
import { ComponentProps } from '@/types';

interface ExampleComponentProps {
  title: string;
  children?: React.ReactNode;
}

export function ExampleComponent({ title, children }: ExampleComponentProps) {
  return (
    <div className="example-component">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### Commit Messages

Use conventional commit format:

```
feat: add voice input support for Tigrinya
fix: resolve translation accuracy issues
docs: update API documentation
style: improve mobile responsiveness
test: add unit tests for AI client
```

### Branch Naming

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation
- `refactor/component-name` - Code refactoring

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Write unit tests for utility functions
- Add integration tests for API routes
- Test components with React Testing Library
- Include tests for Tigrinya text processing

## 🌍 Internationalization

### Adding Tigrinya Content

When adding Tigrinya text:

1. **Use proper Ge'ez script**: ሰላም not selam
2. **Provide English translations**: For accessibility
3. **Cultural context**: Ensure content is culturally appropriate
4. **Educational alignment**: Match Ethiopian curriculum standards

### Translation Guidelines

```typescript
// Good: Bilingual support
const messages = {
  welcome: {
    ti: 'እንቋዕ ብደሓን መጻእኩም',
    en: 'Welcome'
  }
};

// Better: Context-aware translations
const educationalTerms = {
  mathematics: {
    ti: 'ሒሳብ',
    en: 'Mathematics',
    context: 'school_subject'
  }
};
```

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Test on latest version
3. Reproduce the bug
4. Gather system information

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Device: [e.g., iPhone 12]
- Version: [e.g., 1.0.0]

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered

**Educational Impact**
How will this help Tigrinya students?

**Implementation Notes**
Technical considerations (optional)
```

## 🔍 Code Review Process

### For Contributors

1. **Self-review**: Review your own code first
2. **Test thoroughly**: Ensure all tests pass
3. **Documentation**: Update relevant documentation
4. **Small PRs**: Keep pull requests focused and small

### Review Criteria

- ✅ Code quality and style
- ✅ Test coverage
- ✅ Documentation updates
- ✅ Tigrinya language accuracy
- ✅ Educational value
- ✅ Performance impact
- ✅ Accessibility compliance

## 🏆 Recognition

Contributors will be recognized in:

- **README.md**: Contributors section
- **Release notes**: Feature acknowledgments
- **GitHub**: Contributor badges
- **Community**: Social media shoutouts

## 📞 Getting Help

### Community Channels

- **GitHub Discussions**: General questions and ideas
- **GitHub Issues**: Bug reports and feature requests
- **Email**: [contact@yoseph.dev](mailto:contact@yoseph.dev)

### Mentorship

New contributors can request mentorship for:

- First-time contributions
- Tigrinya language integration
- Educational content development
- Technical implementation guidance

## 📋 Checklist for Pull Requests

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] Tigrinya text is accurate (if applicable)
- [ ] Educational content is appropriate
- [ ] Performance impact is considered
- [ ] Accessibility is maintained
- [ ] Mobile responsiveness is preserved

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in TigrayTutor a harassment-free experience for everyone, regardless of:

- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience, nationality
- Personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

**Positive behavior includes:**

- Using welcoming and inclusive language
- Respecting differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**

- Harassment, trolling, or discriminatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct inappropriate in a professional setting

### Enforcement

Report unacceptable behavior to [contact@yoseph.dev](mailto:contact@yoseph.dev). All reports will be reviewed and investigated promptly and fairly.

## 🙏 Thank You

Your contributions help make quality education accessible to Tigrinya-speaking students worldwide. Every contribution, no matter how small, makes a difference in someone's educational journey.

**ሓገዝኩም ንትምህርቲ ህዝቢ ትግራይ ኣገዳሲ እዩ!**

---

*Built with ❤️ for the Tigray educational community*
