# Git Commit Convention

## Basic Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## Type Definitions

Main types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Testing related changes
- `build`: Build system or external dependencies
- `license`: License related changes
- `security`: Security related changes
- `ci`: CI/CD configuration changes
- `chore`: Other changes

## Common Scopes

- `auth`: Authentication related
- `api`: API related
- `ui`: User interface related
- `db`: Database related
- `core`: Core functionality
- `config`: Configuration related

## Quick Start Examples

### 1. New Feature
```
feat(auth): add user login functionality
```

### 2. Bug Fix
```
fix(db): resolve user query cache issue
```

### 3. Documentation Update
```
docs(readme): update installation guide
```

### 4. Multi-line Commit (with body)
```
feat(user): implement user registration

- Add registration form
- Implement email verification
- Add password strength check

Closes #123
```

### 5. Breaking Changes
```
feat(api)!: change user API response format

BREAKING CHANGE: new response format is not backward compatible
```

## Practical Tips

1. **Keep It Concise**:
   - ✅ `feat(cart): add shopping cart feature`
   - ❌ `feat(cart): added a shopping cart feature that allows users to add products`

2. **Use Present Tense**:
   - ✅ `fix(auth): remove duplicate tokens`
   - ❌ `fixed(auth): removed duplicate tokens`

3. **Describe Changes, Not Process**:
   - ✅ `fix(date): correct date format error`
   - ❌ `fix(date): spent two hours debugging date issue`

4. **Link Issues**:
   - `feat(user): add user avatar upload`
   - `Closes #123`

## Common Scenarios Examples

### Feature Development
```
feat(user): add user registration
feat(auth): implement JWT authentication
feat(ui): add data statistics chart
```

### Bug Fixes
```
fix(login): resolve login timeout issue
fix(cache): fix cache invalidation problem
fix(mobile): fix mobile display anomaly
```

### Code Optimization
```
refactor(api): optimize API response structure
perf(query): improve query performance
style(lint): standardize code style
```

### Documentation Updates
```
docs(api): update API documentation
docs(deploy): add deployment instructions
docs(readme): add project screenshots
```

## Important Notes

1. Commit messages should be consistent in language choice (English or Chinese) within the team
2. Scope is optional but recommended for better readability
3. Description should clearly express the changes made
4. Breaking changes must be marked with `BREAKING CHANGE`
5. One commit should do one thing only
