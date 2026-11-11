import { expect, test } from '../setup/component-test.js';

test('w-avatar-group group takes an accessible name', async ({ mount, page }) => {
  await mount('<w-avatar-group label="Participants"><w-avatar text="AB"></w-avatar></w-avatar-group>');
  await expect(page.getByRole('group', { name: 'Participants' })).toHaveCount(1);
});
