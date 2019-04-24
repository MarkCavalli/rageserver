"use strict";

const k = {
    LEFT_MOUSE_BUTTON: 0x01, // VK_LBUTTON
    RIGHT_MOUSE_BUTTON: 0x02, // VK_RBUTTON
    CONTROL_BREAK_PROCESSING: 0x03, // VK_CANCEL
    MIDDLE_MOUSE_BUTTON_THREE_BUTTON_MOUSE: 0x04, // VK_MBUTTON
    X1_MOUSE_BUTTON: 0x05, // VK_XBUTTON1
    X2_MOUSE_BUTTON: 0x06, // VK_XBUTTON2
    BACKSPACE_KEY: 0x08, // VK_BACK
    TAB_KEY: 0x09, // VK_TAB
    CLEAR_KEY: 0x0C, // VK_CLEAR
    ENTER_KEY: 0x0D, // VK_RETURN
    SHIFT_KEY: 0x10, // VK_SHIFT
    CTRL_KEY: 0x11, // VK_CONTROL
    ALT_KEY: 0x12, // VK_MENU
    PAUSE_KEY: 0x13, // VK_PAUSE
    CAPS_LOCK_KEY: 0x14, // VK_CAPITAL
    IME_KANA_MODE: 0x15, // VK_KANA
    IME_HANGUEL_MODE_MAINTAINED_FOR_COMPATIBILITY_USE_VK_HANGUL: 0x15, // VK_HANGUEL
    IME_HANGUL_MODE: 0x15, // VK_HANGUL
    IME_JUNJA_MODE: 0x17, // VK_JUNJA
    IME_FINAL_MODE: 0x18, // VK_FINAL
    IME_HANJA_MODE: 0x19, // VK_HANJA
    IME_KANJI_MODE: 0x19, // VK_KANJI
    ESC_KEY: 0x1B, // VK_ESCAPE
    IME_CONVERT: 0x1C, // VK_CONVERT
    IME_NONCONVERT: 0x1D, // VK_NONCONVERT
    IME_ACCEPT: 0x1E, // VK_ACCEPT
    IME_MODE_CHANGE_REQUEST: 0x1F, // VK_MODECHANGE
    SPACEBAR: 0x20, // VK_SPACE
    PAGE_UP_KEY: 0x21, // VK_PRIOR
    PAGE_DOWN_KEY: 0x22, // VK_NEXT
    END_KEY: 0x23, // VK_END
    HOME_KEY: 0x24, // VK_HOME
    LEFT_ARROW_KEY: 0x25, // VK_LEFT
    UP_ARROW_KEY: 0x26, // VK_UP
    RIGHT_ARROW_KEY: 0x27, // VK_RIGHT
    DOWN_ARROW_KEY: 0x28, // VK_DOWN
    SELECT_KEY: 0x29, // VK_SELECT
    PRINT_KEY: 0x2A, // VK_PRINT
    EXECUTE_KEY: 0x2B, // VK_EXECUTE
    PRINT_SCREEN_KEY: 0x2C, // VK_SNAPSHOT
    INS_KEY: 0x2D, // VK_INSERT
    DEL_KEY: 0x2E, // VK_DELETE
    HELP_KEY: 0x2F, // VK_HELP
    _0_KEY: 0x30,
    _1_KEY: 0x31,
    _2_KEY: 0x32,
    _3_KEY: 0x33,
    _4_KEY: 0x34,
    _5_KEY: 0x35,
    _6_KEY: 0x36,
    _7_KEY: 0x37,
    _8_KEY: 0x38,
    _9_KEY: 0x39,
    A_KEY: 0x41,
    B_KEY: 0x42,
    C_KEY: 0x43,
    D_KEY: 0x44,
    E_KEY: 0x45,
    F_KEY: 0x46,
    G_KEY: 0x47,
    H_KEY: 0x48,
    I_KEY: 0x49,
    J_KEY: 0x4A,
    K_KEY: 0x4B,
    L_KEY: 0x4C,
    M_KEY: 0x4D,
    N_KEY: 0x4E,
    O_KEY: 0x4F,
    P_KEY: 0x50,
    Q_KEY: 0x51,
    R_KEY: 0x52,
    S_KEY: 0x53,
    T_KEY: 0x54,
    U_KEY: 0x55,
    V_KEY: 0x56,
    W_KEY: 0x57,
    X_KEY: 0x58,
    Y_KEY: 0x59,
    Z_KEY: 0x5A,
    LEFT_WINDOWS_KEY_NATURAL_KEYBOARD: 0x5B, // VK_LWIN
    RIGHT_WINDOWS_KEY_NATURAL_KEYBOARD: 0x5C, // VK_RWIN
    APPLICATIONS_KEY_NATURAL_KEYBOARD: 0x5D, // VK_APPS
    COMPUTER_SLEEP_KEY: 0x5F, // VK_SLEEP
    NUMERIC_KEYPAD_0_KEY: 0x60, // VK_NUMPAD0
    NUMERIC_KEYPAD_1_KEY: 0x61, // VK_NUMPAD1
    NUMERIC_KEYPAD_2_KEY: 0x62, // VK_NUMPAD2
    NUMERIC_KEYPAD_3_KEY: 0x63, // VK_NUMPAD3
    NUMERIC_KEYPAD_4_KEY: 0x64, // VK_NUMPAD4
    NUMERIC_KEYPAD_5_KEY: 0x65, // VK_NUMPAD5
    NUMERIC_KEYPAD_6_KEY: 0x66, // VK_NUMPAD6
    NUMERIC_KEYPAD_7_KEY: 0x67, // VK_NUMPAD7
    NUMERIC_KEYPAD_8_KEY: 0x68, // VK_NUMPAD8
    NUMERIC_KEYPAD_9_KEY: 0x69, // VK_NUMPAD9
    MULTIPLY_KEY: 0x6A, // VK_MULTIPLY
    ADD_KEY: 0x6B, // VK_ADD
    SEPARATOR_KEY: 0x6C, // VK_SEPARATOR
    SUBTRACT_KEY: 0x6D, // VK_SUBTRACT
    DECIMAL_KEY: 0x6E, // VK_DECIMAL
    DIVIDE_KEY: 0x6F, // VK_DIVIDE
    F1_KEY: 0x70, // VK_F1
    F2_KEY: 0x71, // VK_F2
    F3_KEY: 0x72, // VK_F3
    F4_KEY: 0x73, // VK_F4
    F5_KEY: 0x74, // VK_F5
    F6_KEY: 0x75, // VK_F6
    F7_KEY: 0x76, // VK_F7
    F8_KEY: 0x77, // VK_F8
    F9_KEY: 0x78, // VK_F9
    F10_KEY: 0x79, // VK_F10
    F11_KEY: 0x7A, // VK_F11
    F12_KEY: 0x7B, // VK_F12
    F13_KEY: 0x7C, // VK_F13
    F14_KEY: 0x7D, // VK_F14
    F15_KEY: 0x7E, // VK_F15
    F16_KEY: 0x7F, // VK_F16
    F17_KEY: 0x80, // VK_F17
    F18_KEY: 0x81, // VK_F18
    F19_KEY: 0x82, // VK_F19
    F20_KEY: 0x83, // VK_F20
    F21_KEY: 0x84, // VK_F21
    F22_KEY: 0x85, // VK_F22
    F23_KEY: 0x86, // VK_F23
    F24_KEY: 0x87, // VK_F24
    NUM_LOCK_KEY: 0x90, // VK_NUMLOCK
    SCROLL_LOCK_KEY: 0x91, // VK_SCROLL
    LEFT_SHIFT_KEY: 0xA0, // VK_LSHIFT
    RIGHT_SHIFT_KEY: 0xA1, // VK_RSHIFT
    LEFT_CONTROL_KEY: 0xA2, // VK_LCONTROL
    RIGHT_CONTROL_KEY: 0xA3, // VK_RCONTROL
    LEFT_MENU_KEY: 0xA4, // VK_LMENU
    RIGHT_MENU_KEY: 0xA5, // VK_RMENU
    BROWSER_BACK_KEY: 0xA6, // VK_BROWSER_BACK
    BROWSER_FORWARD_KEY: 0xA7, // VK_BROWSER_FORWARD
    BROWSER_REFRESH_KEY: 0xA8, // VK_BROWSER_REFRESH
    BROWSER_STOP_KEY: 0xA9, // VK_BROWSER_STOP
    BROWSER_SEARCH_KEY: 0xAA, // VK_BROWSER_SEARCH
    BROWSER_FAVORITES_KEY: 0xAB, // VK_BROWSER_FAVORITES
    BROWSER_START_AND_HOME_KEY: 0xAC, // VK_BROWSER_HOME
    VOLUME_MUTE_KEY: 0xAD, // VK_VOLUME_MUTE
    VOLUME_DOWN_KEY: 0xAE, // VK_VOLUME_DOWN
    VOLUME_UP_KEY: 0xAF, // VK_VOLUME_UP
    NEXT_TRACK_KEY: 0xB0, // VK_MEDIA_NEXT_TRACK
    PREVIOUS_TRACK_KEY: 0xB1, // VK_MEDIA_PREV_TRACK
    STOP_MEDIA_KEY: 0xB2, // VK_MEDIA_STOP
    PLAY_PAUSE_MEDIA_KEY: 0xB3, // VK_MEDIA_PLAY_PAUSE
    START_MAIL_KEY: 0xB4, // VK_LAUNCH_MAIL
    SELECT_MEDIA_KEY: 0xB5, // VK_LAUNCH_MEDIA_SELECT
    START_APPLICATION_1_KEY: 0xB6, // VK_LAUNCH_APP1
    START_APPLICATION_2_KEY: 0xB7, // VK_LAUNCH_APP2
    FOR_ANY_COUNTRY_REGION_THE_KEY: 0xBB, // VK_OEM_PLUS
    FOR_ANY_COUNTRY_REGION_THE_KEY: 0xBC, // VK_OEM_COMMA
    FOR_ANY_COUNTRY_REGION_THE_KEY: 0xBD, // VK_OEM_MINUS
    FOR_ANY_COUNTRY_REGION_THE_KEY: 0xBE, // VK_OEM_PERIOD
    USED_FOR_MISCELLANEOUS_CHARACTERS_IT_CAN_VARY_BY_KEYBOARD: 0xDB, // VK_OEM_4
    USED_FOR_MISCELLANEOUS_CHARACTERS_IT_CAN_VARY_BY_KEYBOARD: 0xDC, // VK_OEM_5
    USED_FOR_MISCELLANEOUS_CHARACTERS_IT_CAN_VARY_BY_KEYBOARD: 0xDD, // VK_OEM_6
    USED_FOR_MISCELLANEOUS_CHARACTERS_IT_CAN_VARY_BY_KEYBOARD: 0xDE, // VK_OEM_7
    USED_FOR_MISCELLANEOUS_CHARACTERS_IT_CAN_VARY_BY_KEYBOARD: 0xDF, // VK_OEM_8
    OEM_SPECIFIC: 0xE1,
    EITHER_THE_ANGLE_BRACKET_KEY_OR_THE_BACKSLASH_KEY_ON_THE_RT_102_KEY_KEYBOARD: 0xE2, // VK_OEM_102
    IME_PROCESS_KEY: 0xE5, // VK_PROCESSKEY
    OEM_SPECIFIC: 0xE6,
    USED_TO_PASS_UNICODE_CHARACTERS_AS_IF_THEY_WERE_KEYSTROKES_THE_VK_PACKET_KEY_IS_THE_LOW_WORD_OF_A_32_BIT_VIRTUAL_KEY_VALUE_USED_FOR_NON_KEYBOARD_INPUT_METHODS_FOR_MORE_INFORMATION_SEE_REMARK_IN_KEYBDINPUT_SEND_INPUT_WM_KEYDOWN_AND_WM_KEYUP: 0xE7, // VK_PACKET
    ATTN_KEY: 0xF6, // VK_ATTN
    CR_SEL_KEY: 0xF7, // VK_CRSEL
    EX_SEL_KEY: 0xF8, // VK_EXSEL
    ERASE_EOF_KEY: 0xF9, // VK_EREOF
    PLAY_KEY: 0xFA, // VK_PLAY
    ZOOM_KEY: 0xFB, // VK_ZOOM
    PA1_KEY: 0xFD, // VK_PA1
    CLEAR_KEY: 0xFE, // VK_OEM_CLEAR
};

const keys = mp.keys;

keys.bind(k.E_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-E');
});

keys.bind(k.NUMERIC_KEYPAD_0_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num0');
});

keys.bind(k.NUMERIC_KEYPAD_1_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num1');
});

keys.bind(k.NUMERIC_KEYPAD_2_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num2');
});

keys.bind(k.NUMERIC_KEYPAD_3_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num3');
});

keys.bind(k.NUMERIC_KEYPAD_4_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num4');
});

keys.bind(k.NUMERIC_KEYPAD_5_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num5');
});

keys.bind(k.NUMERIC_KEYPAD_6_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num6');
});

keys.bind(k.NUMERIC_KEYPAD_7_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num7');
});

keys.bind(k.NUMERIC_KEYPAD_8_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num8');
});

keys.bind(k.NUMERIC_KEYPAD_9_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num9');
});

keys.bind(k.F4_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-F4');
});

keys.bind(k.ADD_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-Num+');
});

keys.bind(k.M_KEY, false, function() {
    if (mp.gui.cursor.visible) return;
    mp.events.callRemote('sKeys-M');
});

