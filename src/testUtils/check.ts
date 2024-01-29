export function checkColimaTestcontainersDarwin() {
  if (
    process.platform === 'darwin' &&
    (process.env.TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE === undefined ||
      !process.env.NODE_OPTIONS.includes('--dns-result-order=ipv4first'))
  ) {
    throw new Error(
      'On macOs, run with the following command to make testcontainers + colima work: `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE=/var/run/docker.sock NODE_OPTIONS="$NODE_OPTIONS --dns-result-order=ipv4first" <command>`'
    );
  }
}
