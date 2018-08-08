/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Sample transaction
 * @param {org.petition.prov.participants.SampleTransaction} sampleTransaction
 * @transaction
 */
async function sampleTransaction(tx) {
    // Save the old value of the asset.
    const oldValue = tx.asset.value;

    // Update the asset with the new value.
    tx.asset.value = tx.newValue;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.petition.prov.participants.SampleAsset'); 
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.petition.prov.participants', 'SampleEvent');
    event.asset = tx.asset;
    event.oldValue = oldValue;
    event.newValue = tx.newValue;
    emit(event);
}
/**
 * CreatePetition
 * @param {org.petition.prov.participants.CreateCivil} CivilData
 * @transaction
 */
function    CreateCivil(CivilData) {
    return getParticipantRegistry('org.petition.prov.participants.Civil')
        .then(function(CivilRegistry){
            var factory = getFactory();
            var NS =  'org.petition.prov.participants';

            
            var Civil = factory.newResource(NS,'Civil',CivilData.CivilId);
            
            Civil.CivilId = CivilData.CivilId;
            Civil.CivilDetail = CivilData.CivilDetail;

            // 이벤트 발생 필요함.
            // var event = factory.newEvent(NS, 'FlightCreated');
            // event.flightId = flightId;
            // emit(event);

            // 4. Add to registry
            return CivilRegistry.add(Civil);
        });
}


/**
 * CreatePetition
 * @param {org.petition.prov.petition.CreatePetition} PetitionData
 * @transaction
 */
function    createPetition(PetitionData) {

    /**
     * 1. Validate the schedule data
     * If the date is a past date then throw an error
     */
    // var timeNow = new Date().getTime();
    // var schedTime = new Date(PetitionData.uploadDate).getTime();
    // if(schedTime < timeNow){
    //     throw new Error("Upload Datetime cannot be in the past!!!");
    // }

    // Get the Asset Registry

    // return getAssetRegistry('org.acme.airline.flight.Flight')
    return getAssetRegistry('org.petition.prov.petition.Petition')
        
        .then(async function(PetitionRegistry){ //flightRegistry가 여깄었음
            // Now add the Flight - global function getFactory() called
            var factory = getFactory();

            var  NS =  'org.petition.prov.petition'; // Namespace
            var NS_participant = 'org.petition.prov.participants.Civil'
            
            // 현재 필요한 것.
            // 1. participant에 정의된 Civil 본인만이 자기 civilid로 민원을 실행할 수 있어야 함.
            // 네트워크에서 접속하면 본인의 card로 접속할 테니... 그걸 구분하는 방법이 필요한데.

            // var currentCivil = getFullyQualifiedIdentifier(); 왜 인식을 못하지..
            // if (currentCivil !== PetitionData.Civil){
            //     throw new Error("Not same Civil.")
            // }
            
            var timeNow = new Date().getTime()
            var PetitionId = String(PetitionData.Civil.CivilId)+'-'+String(timeNow); 
            // 일단 민원 고유번호를 시민번호 + 시간으로 정함.
            var petition = factory.newResource(NS,'Petition',PetitionId);
            
            petition.PetitionId = PetitionId;
            petition.Civil = PetitionData.Civil;
            petition.Content = PetitionData.Content;
            petition.title = PetitionData.title;
            
            
        
            // // Flight asset has an instance of the concept
            // // 2.2 Use the factory to create an instance of concept
            // var route = factory.newConcept(NS,"Route");

            // // 2.3 Set the data in the concept 'route'
            // route.origin = flightData.origin;
            // route.destination = flightData.destination;
            // route.schedule = flightData.schedule;

            // // 2.4 Set the route attribute on the asset
            // flight.route = route;
            

            // // 3 Emit the event FlightCreated
            // var event = factory.newEvent(NS, 'FlightCreated');
            // event.flightId = flightId;
            // emit(event);

            // 4. Add to registry
            return PetitionRegistry.add(petition);
        });
}

        
