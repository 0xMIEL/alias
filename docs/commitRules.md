## Commit Message Guidelines

### Commit Message Format

```
<type>: <subject>
<BLANK LINE>
<body>(optional)
<BLANK LINE>
<footer>(optional)
```


The header is mandatory, body and footer is optional. Footer should contain a closing reference to an issue if any.

Sample:

```text
    feat: add user login functionality

    This feature allows users to log in with their credentials, enhancing the user experience and securing user data.

    Closes: iss#5
```

```text
    docs: update readme.md

    Closes: iss#22
```

```text
    merge: merge branch 'iss#1' into master
```

### Type

Must be one of the following:

- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests
- **merge**: Merging branches

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer is the place to reference GitHub issues that this commit Closes.