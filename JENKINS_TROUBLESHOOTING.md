# Jenkins Pipeline Troubleshooting Guide

## Checkout SCM Failure - Common Solutions

The error `GitException: Failed to fetch from https://github.com/ShubhamGupta76/Weather.git` typically occurs due to one of the following issues:

### 1. **Repository Access Issues**

#### Check if repository exists:
- Visit: https://github.com/ShubhamGupta76/Weather
- Verify the repository is accessible and not deleted/renamed

#### Check repository visibility:
- If the repository is **private**, ensure Jenkins credentials have access
- If the repository is **public**, verify the URL is correct

### 2. **Jenkins Credentials Configuration**

#### Verify credentials in Jenkins:
1. Go to Jenkins Dashboard → Manage Jenkins → Credentials
2. Find the credential ID used in your pipeline (e.g., `cc150663-186b-4796-8c37-003b5d405188`)
3. Verify:
   - Credential is not expired
   - Username/token is correct
   - Credential has proper permissions

#### For GitHub repositories, use one of these:
- **Personal Access Token (PAT)** - Recommended
  - Generate at: https://github.com/settings/tokens
  - Required scopes: `repo` (for private repos) or `public_repo` (for public repos)
- **SSH Key** - Alternative
  - Add SSH key to Jenkins credentials
  - Use SSH URL format: `git@github.com:ShubhamGupta76/Weather.git`

### 3. **Jenkins Job Configuration**

#### Check Jenkins job SCM settings:
1. Open your pipeline job: `weather-frontend-pipeline`
2. Click "Configure"
3. Under "Pipeline" section, check:
   - **Definition**: Should be "Pipeline script from SCM"
   - **SCM**: Should be "Git"
   - **Repository URL**: Verify it matches: `https://github.com/ShubhamGupta76/Weather.git`
   - **Credentials**: Select the correct credential
   - **Branch**: Verify branch name (usually `*/main` or `*/master`)

### 4. **Network and Git Configuration**

#### Check Git installation on Jenkins agent:
- Verify Git is installed: `git --version`
- Check Git path in Jenkins: Manage Jenkins → Global Tool Configuration → Git

#### Check network connectivity:
- Jenkins agent should be able to reach `github.com`
- Check firewall/proxy settings
- Verify DNS resolution

### 5. **Alternative: Use Explicit Repository in Jenkinsfile**

If `checkout scm` continues to fail, you can explicitly define the repository in the Jenkinsfile. See `Jenkinsfile.explicit` for an example.

### 6. **Quick Fixes to Try**

1. **Update credentials**:
   - Generate a new GitHub Personal Access Token
   - Update credentials in Jenkins

2. **Verify repository URL**:
   - Ensure URL is exactly: `https://github.com/ShubhamGupta76/Weather.git`
   - Check for typos or case sensitivity

3. **Test repository access manually**:
   ```bash
   git ls-remote https://github.com/ShubhamGupta76/Weather.git
   ```

4. **Check Jenkins logs**:
   - Go to: Manage Jenkins → System Log
   - Look for Git-related errors

5. **Restart Jenkins** (if needed):
   - Sometimes Jenkins needs a restart after credential changes

### 7. **Common Error Messages and Solutions**

| Error | Solution |
|-------|----------|
| `Failed to fetch from origin` | Check credentials and repository access |
| `Repository not found` | Verify repository exists and URL is correct |
| `Authentication failed` | Update credentials in Jenkins |
| `Connection timeout` | Check network connectivity and firewall |
| `Permission denied` | Verify credentials have proper permissions |

## Testing the Fix

After applying fixes:
1. Trigger a new build manually
2. Monitor the "Checkout SCM" stage
3. Check console output for any remaining errors

## Need More Help?

- Check Jenkins console output for detailed error messages
- Review Jenkins system logs
- Verify Git plugin is up to date in Jenkins

