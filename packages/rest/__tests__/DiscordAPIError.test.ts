import { DiscordAPIError } from '../src';

test('Unauthorized', () => {
	const error = new DiscordAPIError(
		{ message: '401: Unauthorized', code: 0 },
		0,
		401,
		'PATCH',
		'https://discord.com/api/v8/guilds/:id',
	);

	expect(error.code).toBe(0);
	expect(error.message).toBe('401: Unauthorized');
	expect(error.method).toBe('PATCH');
	expect(error.name).toBe('DiscordAPIError[0]');
	expect(error.status).toBe(401);
	expect(error.url).toBe('https://discord.com/api/v8/guilds/:id');
});

test('Invalid Form Body Error (error.x._errors.n)', () => {
	const error = new DiscordAPIError(
		{
			code: 50035,
			errors: {
				username: { _errors: [{ code: 'BASE_TYPE_BAD_LENGTH', message: 'Must be between 2 and 32 in length.' }] },
			},
			message: 'Invalid Form Body',
		},
		50035,
		400,
		'PATCH',
		'https://discord.com/api/v8/users/@me',
	);

	expect(error.code).toBe(50035);
	expect(error.message).toBe(
		[
			'Invalid Form Body', //
			'BASE_TYPE_BAD_LENGTH: Must be between 2 and 32 in length.',
		].join('\n'),
	);
	expect(error.method).toBe('PATCH');
	expect(error.name).toBe('DiscordAPIError[50035]');
	expect(error.status).toBe(400);
	expect(error.url).toBe('https://discord.com/api/v8/users/@me');
});

test('Invalid FormFields Error (error.errors.x.x._errors.n._errors)', () => {
	const error = new DiscordAPIError(
		{
			code: 50035,
			errors: {
				form_fields: {
					label: { _errors: [{ _errors: [{ code: 'BASE_TYPE_REQUIRED', message: 'This field is required' }] }] },
				},
			},
			message: 'Invalid Form Body',
		},
		50035,
		400,
		'PATCH',
		'https://discord.com/api/v8/guilds/:id',
	);

	expect(error.code).toBe(50035);
	expect(error.message).toBe(
		[
			'Invalid Form Body', //
			'BASE_TYPE_REQUIRED: This field is required',
		].join('\n'),
	);
	expect(error.method).toBe('PATCH');
	expect(error.name).toBe('DiscordAPIError[50035]');
	expect(error.status).toBe(400);
	expect(error.url).toBe('https://discord.com/api/v8/guilds/:id');
});
