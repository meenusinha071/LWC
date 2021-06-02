
public with sharing class SecureInfo {
    public SecureInfo() {

    }

    @AuraEnabled
    public static Boolean IsSecureInfoShared( String strChatNumber) {
        system.debug('strChatNumber=22=='+strChatNumber);
        
        List<LiveChatTranscript> lstChatTranscript = [Select id, name ,	Credit_Card_Info__c from LiveChatTranscript where name =: strChatNumber];
       system.debug('lstChatTranscript==='+lstChatTranscript);
       
            if(!lstChatTranscript.isEmpty())
                return (lstChatTranscript[0].Credit_Card_Info__c != null);
            else return false;
            
        
      
    }

    @AuraEnabled
    public static LivechatTranscript getChatRecord(String recordId){
        system.debug('recordId===='+recordId);
        return [
            SELECT Id, Name, Credit_Card_Info__c
            FROM LivechatTranscript
            where id =: recordId
            LIMIT 1
        ];
    }

    @AuraEnabled
    public static void removeCCinfo(String recordId){
        system.debug('recordId===='+recordId);
        update new LivechatTranscript(id= recordId , Credit_Card_Info__c = null);
    }




}
