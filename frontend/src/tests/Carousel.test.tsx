import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {useAuth, AuthProvider} from '../context/AuthContext'
import {ApplyProvider} from '../context/ApplyContext'
import {VenueProvider} from '../context/VenueContext'
import {NotifProvider} from '../context/NotifContext'
import {UnavailProvider} from '../context/UnavailContext'
import {users, User} from '../types/users'
import {venues, Venue} from '../types/venues'
import Carousel from '../components/Carousel';

//this test references this video: https://www.youtube.com/watch?v=JBSUgDxICg8 

//test data
const allVenues: Venue[] = venues;

//mocking the router for authprovider https://forum.freecodecamp.org/t/how-to-test-next-js-page-using-userouter-with-jest/654115 
 jest.mock("next/router", () => ({
    useRouter() {
      return {
        prefetch: () => null
      };
    }
}));

//create mock authcontext to get specific user we want: TIM https://stackoverflow.com/questions/64272960/mocking-react-context-provider-in-jest-with-react-testing-library#:~:text=To%20explain%20in%20more%20detail,fn()%2C%20logout:%20jest. 
jest.mock('../context/AuthContext', () => (
    {
        useAuth: () => ({
            currUser: users[2], //i dont think this actually is needed for logic.
        })
    }
));

describe("Carousel items", () => {
    
    // first test: use the actual contexts (except authcontext, ned to mock useAuth. but mock the router
    it("Correct carousel item is displayed when next button is pressed", () => {
        
        //idk if i need all the providers actually
        const {getByTestId} = render(
            <NotifProvider>
                <VenueProvider>
                    <UnavailProvider>
                        <ApplyProvider>
                            {/* <AuthProvider> */}
                                <Carousel type='all' ranked={false} carouselItems={allVenues}/>
                            {/* </AuthProvider> */}
                        </ApplyProvider>
                    </UnavailProvider>
                </VenueProvider>    
            </NotifProvider>
        );
        
        //get initial details of the first card
        const initialVenueName: string = getByTestId("venueName").textContent;
        expect(initialVenueName).toEqual(allVenues[0].name); 

        //click the next button, should get the next venue
        const nextButton = getByTestId("forwardButton");
        fireEvent.click(nextButton);
        const nextVenueName1: string = getByTestId("venueName").textContent;
        expect(nextVenueName1).toEqual(allVenues[1].name); 

        //click the back button, should get initial venue again
        const backButton = getByTestId("backButton");
        fireEvent.click(backButton);
        const nextVenueName2: string = getByTestId("venueName").textContent;
        expect(nextVenueName2).toEqual(allVenues[0].name); 

    });

});