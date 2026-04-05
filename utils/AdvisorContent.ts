export interface AdvisorMessage {
    type: 'SLOTH' | 'DROP_BEAR';
    originalText: string;
    reversedText: string;
    hint?: string;
}

export const advisorMessages: AdvisorMessage[] = [
    { type: 'SLOTH', originalText: "Take it slow, the answer is hidden in plain sight.", reversedText: ".thgis nialp ni neddih si rewsna eht ,wols ti ekaT" },
    { type: 'SLOTH', originalText: "The key is to wait for the moment of clarity.", reversedText: ".ytiralc fo tnemom eht rof tiaw ot si yek ehT" },
    { type: 'SLOTH', originalText: "Patience is a virtue, the path will reveal itself.", reversedText: ".flesti laever lliw htap eht ,eutriv a si ecneitaP" },
    { type: 'DROP_BEAR', originalText: "Look up, or you'll never see what's coming.", reversedText: ".gnimoc s'tahw ees reven ll'uoy ro ,pu kooL" },
    { type: 'DROP_BEAR', originalText: "The loop is your cage. Break the cycle.", reversedText: ".elcyc eht kaerB .egac ruoy si pool ehT" },
    { type: 'DROP_BEAR', originalText: "They are tracking your every move. Move fast.", reversedText: ".tsaf evoM .evom yreve ruoy gnikcart era yehT" },
];
