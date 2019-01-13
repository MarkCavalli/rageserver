mp.events.add("playerReady", (player) => {
    player.notify = function(message, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
        this.call("BN_Show", [message, flashing, textColor, bgColor, flashColor]);
    };

    player.notifyWithPicture = function(title, sender, message, notifPic, icon = 0, flashing = false, textColor = -1, bgColor = -1, flashColor = [77, 77, 77, 200]) {
        this.call("BN_ShowWithPicture", [title, sender, message, notifPic, icon, flashing, textColor, bgColor, flashColor]);
    };
});