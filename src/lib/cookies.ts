
export function SetCookie(name: string, value: string, exdays: number = 365) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expiresUTC = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expiresUTC + ";size=4096;";// + ";path=/";
}