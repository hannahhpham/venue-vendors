import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {useAuth, AuthProvider} from '../context/AuthContext'
import {ApplyProvider} from '../context/ApplyContext'
import {VenueProvider} from '../context/VenueContext'
import {NotifProvider} from '../context/NotifContext'
import {UnavailProvider} from '../context/UnavailContext'
import {users, User} from '../types/users'
import Stars from '../components/Stars';

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
            currUser: users[2],
            getRepRating: users[2].reputation,
        })
    }
));

describe("Stars", () => {
    
    // first test: use the actual contexts (except authcontext, ned to mock useAuth. but mock the router
    it("correct number of stars for no previous applications", () => {
        
        const {getByTestId} = render(
            <NotifProvider>
                <VenueProvider>
                    <UnavailProvider>
                        <ApplyProvider>
                            {/* <AuthProvider> */}
                                <Stars type={"hirerCredibility"} /> 
                            {/* </AuthProvider> */}
                        </ApplyProvider>
                    </UnavailProvider>
                </VenueProvider>    
            </NotifProvider>
        );
        
        //this is the number of stars
        const starString: string = getByTestId("starString").textContent;
        expect(starString).toEqual("☆ ☆ ☆ ☆ ☆"); 
    });

});