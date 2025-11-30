-- Advanced Energy System Migration
-- Implements passive recharge, dynamic capacity, and delay logic

-- 1. Add new columns to user_credits
alter table public.user_credits
add column if not exists max_capacity int default 100 not null,
add column if not exists last_energy_usage_at timestamp with time zone default now();

-- 2. Function to calculate current energy with passive recharge
create or replace function public.calculate_current_energy(user_uuid uuid)
returns jsonb as $$
declare
  user_credit_row public.user_credits%rowtype;
  seconds_since_last_use int;
  recharge_start_delay int := 3600; -- 1 hour delay
  recharge_rate_per_sec float := 20.0 / 3600.0; -- 20 energy per hour
  passive_cap int := 100;
  virtual_balance int;
  recharge_amount int;
begin
  -- Get user credits
  select * into user_credit_row from public.user_credits where user_id = user_uuid;
  
  if not found then
    return jsonb_build_object('current_balance', 0, 'max_capacity', 100);
  end if;

  -- Calculate time passed
  seconds_since_last_use := extract(epoch from (now() - user_credit_row.last_energy_usage_at));

  -- Logic:
  -- If balance >= max_capacity, no recharge needed.
  -- If balance >= passive_cap (100), no passive recharge (unless paid user logic changes, but spec says auto-recharge stops at 100).
  
  if user_credit_row.balance >= passive_cap then
    return jsonb_build_object(
      'current_balance', user_credit_row.balance, 
      'max_capacity', user_credit_row.max_capacity
    );
  end if;

  -- Check delay
  if seconds_since_last_use < recharge_start_delay then
    -- Still in delay period, return current stored balance
    return jsonb_build_object(
      'current_balance', user_credit_row.balance, 
      'max_capacity', user_credit_row.max_capacity
    );
  end if;

  -- Calculate recharge
  -- Time eligible for recharge = Total time - Delay
  recharge_amount := floor((seconds_since_last_use - recharge_start_delay) * recharge_rate_per_sec);
  
  -- Virtual balance = Stored balance + Recharge
  virtual_balance := user_credit_row.balance + recharge_amount;

  -- Cap at passive_cap (100)
  if virtual_balance > passive_cap then
    virtual_balance := passive_cap;
  end if;

  return jsonb_build_object(
    'current_balance', virtual_balance, 
    'max_capacity', user_credit_row.max_capacity
  );
end;
$$ language plpgsql security definer;

-- 3. Function to deduct energy (updates last_energy_usage_at)
create or replace function public.deduct_energy(user_uuid uuid, amount int)
returns boolean as $$
declare
  current_energy_data jsonb;
  current_val int;
begin
  -- First, "commit" any passive recharge to the balance column
  -- (This simplifies logic: we materialize the virtual balance before spending)
  current_energy_data := public.calculate_current_energy(user_uuid);
  current_val := (current_energy_data->>'current_balance')::int;

  if current_val < amount then
    return false; -- Insufficient funds
  end if;

  -- Update record
  update public.user_credits
  set 
    balance = current_val - amount,
    total_spent = total_spent + amount,
    last_energy_usage_at = now(),
    updated_at = now()
  where user_id = user_uuid;

  return true;
end;
$$ language plpgsql security definer;
