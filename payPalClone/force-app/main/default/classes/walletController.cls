public with sharing class walletController {
    @AuraEnabled(cacheable=true)
    public static wallet__c walletCheck(String user) {

        return [select Id,Name,balance__c,Standard_User__c from wallet__c where Standard_User__c=:user];

    }
}
