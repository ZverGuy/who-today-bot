

const phraseRegex = new RegExp("чуйка, кто сегодня (.+)");

export const isBotPing = (message: string): boolean => {
    return phraseRegex.test(message.toLowerCase());
}

export const getTextAfterRegexPattern = (message: string): string => {
    const match = phraseRegex.exec(message.toLowerCase().replace("?", ""));
    if(match == null) {
        return "Никто"
    } else {return match[1]}
}