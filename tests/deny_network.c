#include <errno.h>
#include <fcntl.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <unistd.h>

int socket(int domain, int type, int protocol) {
    const char *marker = getenv("SEP_NETWORK_MARKER");
    if (marker != NULL) {
        int fd = open(marker, O_CREAT | O_WRONLY, 0600);
        if (fd >= 0) close(fd);
    }
    (void)domain;
    (void)type;
    (void)protocol;
    errno = EPERM;
    return -1;
}
