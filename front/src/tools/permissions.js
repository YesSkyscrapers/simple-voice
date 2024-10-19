const askMicrophonePermissions = async () => {
    return navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
            stream.getTracks().forEach(function (track) {
                track.stop()
            })
            return true
        })
        .catch((err) => false)
}

const checkMicrophonePermission = async () => {
    return navigator.permissions.query({ name: 'microphone' }).then((permissionStatus) => {
        return permissionStatus.state
    })
}

export { askMicrophonePermissions, checkMicrophonePermission }
