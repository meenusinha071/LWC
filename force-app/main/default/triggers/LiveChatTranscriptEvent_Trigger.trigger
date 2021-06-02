trigger LiveChatTranscriptEvent_Trigger on LiveChatTranscriptEvent (before insert,before update) {

    Set<String> setEventType = new Set<String> {'ChatbotEndChat', 
    'ChatbotEndedChatByAction', 'EndAgent', 'EndVisitor'};
    
    system.debug('trigger====='+[select id, LiveChatTranscriptId, Type from LiveChatTranscriptEvent  where Id IN :Trigger.New ]);

    list<LiveChatTranscript> lstChatToUpdate = new list<LiveChatTranscript>();
    set<id> chatId = new set<id>();
    
    for(LiveChatTranscriptEvent objEvent: Trigger.new)
    {
        if(setEventType.contains(objEvent.type ))
        chatId.add(objEvent.LiveChatTranscriptId);
    }
    system.debug('chatId==='+chatId);

    if(!chatId.isEmpty())
    {
        for(LiveChatTranscript objChat : [Select Credit_Card_Info__c from LiveChatTranscript where Id IN : chatId and Credit_Card_Info__c != null])
        {
            lstChatToUpdate.add(new LiveChatTranscript(id= objChat.id, Credit_Card_Info__c = null));
        }
    }
     system.debug('lstChatToUpdate==='+lstChatToUpdate);
    if(!lstChatToUpdate.isEmpty())
        update lstChatToUpdate;
}