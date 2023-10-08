CREATE TABLE public."conversion" (
	currency_from varchar NOT NULL,
	currency_to varchar NOT NULL,
	amount_from float8 NOT NULL,
	amount_to float8 NOT NULL,
	conversion_rate float8 NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX conversion_currency_from_idx ON public.conversion USING btree (currency_from, currency_to);
CREATE INDEX conversion_currency_to_idx ON public.conversion USING btree (currency_to, currency_from);
