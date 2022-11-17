public with sharing class billRecord {
    @AuraEnabled(cacheable=true)
        public static List<bills__c> getBill(String searchKey) {
            String strkey = '%'+searchKey+'%';
            return [SELECT Id,Name,bill_amount__c,pay_before__c,paid__c,category__c,customer__c FROM bills__c where bills__c.paid__c = FALSE ];
        }
}
