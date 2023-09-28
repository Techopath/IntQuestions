import { request, test, expect } from '@playwright/test';

/**
 * Assumptions: 
 * 1. We assume that the blue always move the same movements 
 * when orange makes the same movements in each run.
 * 2. If we have any insights on how blue make move, 
 * then we may me able to implement orange's movement's based on blue's outcome.
 * 
 * Locator best practices: Per plwaywright elemnt location we should locate elemnt's based on getByRole(), 
 * getByPlaceholder(), getByText(), getByTestId() etc. So these are more preferred over css/xpath locators. 
 * To keep elements robust and not flaky, getByTestId can be implemented if other methods does not apply. 
 * 
 * 3. For This exercises I kept all elements, environmental variables and endpoints within the tests. 
 * Otherwise, in real framework we can implement Page Object Model to make the code more readable, and maintainable. 
 * We can read environmental variables from a separate file for easier readabiity and maintaninance in case of new changes. 
 * 
 * 4. We can make more understandable variable namings 
 * 
 * 5. We can improve scripts by writing reusable functions. 
 */

test('Test The Checkers Game', async ({ page }) => {
  await page.goto('https://www.gamesforthebrain.com/game/checkers/');
  await expect(page.getByRole('heading', { name: 'Checkers' })).toBeVisible();
  await expect(page.getByText('Select an orange piece to move.')).toBeVisible();
  await page.locator('div:nth-child(6) > img:nth-child(4)').click();
  await page.locator('div:nth-child(5) > img:nth-child(5)').click();
  await expect(page.getByText('Make a move.')).toBeVisible();
  await page.locator('div:nth-child(6) > img:nth-child(6)').click();
  await page.locator('div:nth-child(5) > img:nth-child(7)').click();
  await page.locator('div:nth-child(7) > img:nth-child(5)').click();
  await page.locator('div:nth-child(5) > img:nth-child(7)').click();
  await page.locator('div:nth-child(5) > img:nth-child(5)').click();
  await page.locator('div:nth-child(4) > img:nth-child(6)').click();
  await page.getByRole('link', { name: 'Restart...' }).click();
  await expect(page.getByText('Select an orange piece to move.')).toBeVisible();
});


test('Test The Card Game - find which player has Black JACK!', async ({page}) => {
  await page.goto('https://deckofcardsapi.com/');
  await expect( page.getByRole('heading', { name: 'Deck of Cards' })).toBeVisible();

  const apiContext = await request.newContext();
  const baseURL = 'https://deckofcardsapi.com';

  // Get new deck
  const newDeckEndPoint = '/api/deck/new/';
  const responseForNewDeck = await apiContext.post(`${baseURL}${newDeckEndPoint}`);
  expect(responseForNewDeck.ok()).toBeTruthy();
  console.log(await responseForNewDeck.json());
  const jsonResponse = await responseForNewDeck.json();
  const deckID = jsonResponse.deck_id;

  // shuffle the deck
  const shuffleExistingDeckEndPoint = `/api/deck/${deckID}/shuffle/`;
  const responseForShuffle = await apiContext.get(`${baseURL}${shuffleExistingDeckEndPoint}`);
  expect(responseForShuffle.ok()).toBeTruthy();
  console.log(await responseForShuffle.json());

  // Deal 3 cards to 2 players / When POST method is used, results show 1 draw, but with GET 3 results come up. 
  const dealCardsEndPoint = `/api/deck/${deckID}/draw/?count=3`;
  const playerNumber = 2;

  // loop through the players cards and see which one has jack! I did not see any reference to the jack colors, so I found all type of jacks only. 
  for (let index = 1; index <= playerNumber; index++) {
    const jResponse = await apiContext.get(`${baseURL}${dealCardsEndPoint}`);
    const jr = await jResponse.json()
    expect(jResponse.ok()).toBeTruthy();

      for(var i = 0; i < jr.cards.length; i++) {
        var value = jr.cards[i].value;
        var code = jr.cards[i].code;

        if(value === 'JACK'){
          console.log(`Player ${index} has jack with value: ${value} and code: ${code}`);
        }else {
          console.log(`Player ${index} has no other JACK!!!`);
        }
      }

  }
});