import { expect, readEvents, recordEvents, test } from '../setup/component-test.js';

test('w-calendar renders a localized month grid with selection, today, week numbers, and bounds', async ({ mount, page }) => {
  await mount(`
    <w-calendar
      id="calendar"
      value="2026-06-13"
      now="2026-06-27 10:30"
      first-day-of-week="1"
      min-weeks="6"
      show-week
      min="2026-06-05"
      max="2026-07-03"
    ></w-calendar>
  `);

  await expect(page.locator('#calendar .w-calendar')).toHaveClass(/w-calendar--month/);
  await expect(page.locator('#calendar .w-calendar-title')).toContainText('June 2026');
  await expect(page.locator('#calendar .w-calendar-weekday').nth(0)).toHaveText('Mon');
  await expect(page.locator('#calendar .w-calendar-week')).toHaveCount(6);
  await expect(page.locator('#calendar .w-calendar-week > .w-calendar-week-number')).toHaveCount(6);
  await expect(page.locator('#calendar [data-date-cell="2026-06-13"]')).toHaveClass(/selected/);
  await expect(page.locator('#calendar [data-date-cell="2026-06-27"]')).toHaveClass(/today/);
  await expect(page.locator('#calendar [data-date="2026-06-04"]')).toBeDisabled();
  await expect(page.locator('#calendar [data-date="2026-07-04"]')).toBeDisabled();
});

test('w-calendar navigation controls and methods move the active range', async ({ mount, page }) => {
  await mount('<w-calendar id="calendar" value="2026-06-13" now="2026-08-09 08:00"></w-calendar>');
  await recordEvents(page, '#calendar', ['change']);

  await page.locator('#calendar [data-calendar-nav="next"]').click();
  await expect(page.locator('#calendar')).toHaveAttribute('value', '2026-07-13');
  await expect(page.locator('#calendar .w-calendar-title')).toContainText('July 2026');

  await page.locator('#calendar').evaluate((calendar) => calendar.prev());
  await expect(page.locator('#calendar')).toHaveAttribute('value', '2026-06-13');

  await page.locator('#calendar [data-calendar-nav="today"]').click();
  await expect(page.locator('#calendar')).toHaveAttribute('value', '2026-08-09');

  const events = await readEvents(page, '#calendar');
  expect(events).toHaveLength(3);
  expect(events[0].detail).toMatchObject({
    reason: 'move',
    value: '2026-07-13',
    start: '2026-07-01',
    end: '2026-07-31',
  });
  expect(events[2].detail).toMatchObject({ reason: 'today', value: '2026-08-09' });
});

test('w-calendar selects dates with pointer and keyboard using native events', async ({ mount, page }) => {
  await mount('<w-calendar id="calendar" value="2026-06-13"></w-calendar>');
  await recordEvents(page, '#calendar', ['click', 'input', 'change']);

  await page.locator('#calendar [data-date="2026-06-18"]').click();
  await expect(page.locator('#calendar')).toHaveAttribute('value', '2026-06-18');

  const selected = page.locator('#calendar [data-date="2026-06-18"]');
  await selected.press('ArrowRight');
  await page.locator('#calendar [data-date="2026-06-19"]').press('Enter');
  await expect(page.locator('#calendar')).toHaveAttribute('value', '2026-06-19');

  const events = await readEvents(page, '#calendar');
  expect(events.map((event) => event.type)).toEqual([
    'click', 'input', 'change',
    'click', 'input', 'change',
  ]);
  expect(events[0].detail).toMatchObject({ kind: 'date', date: '2026-06-18' });
  expect(events[5].detail).toMatchObject({ reason: 'select', value: '2026-06-19' });
});

test('w-calendar renders week, day, 4day, and custom daily interval views', async ({ mount, page }) => {
  await mount(`
    <w-calendar
      id="calendar"
      type="week"
      value="2026-06-10"
      first-interval="8"
      interval-count="4"
      interval-minutes="30"
      interval-height="40"
      interval-width="72"
      format="24hr"
    ></w-calendar>
  `);

  await expect(page.locator('#calendar .w-calendar-day-column')).toHaveCount(7);
  await expect(page.locator('#calendar .w-calendar-time-label')).toHaveCount(4);
  await expect(page.locator('#calendar .w-calendar-time-label').nth(0)).toHaveText('04:00');
  await expect(page.locator('#calendar .w-calendar-schedule')).toHaveCSS('--w-calendar-interval-height', '40px');

  await page.locator('#calendar').evaluate((calendar) => calendar.setAttribute('type', 'day'));
  await expect(page.locator('#calendar .w-calendar-day-column')).toHaveCount(1);

  await page.locator('#calendar').evaluate((calendar) => calendar.setAttribute('type', '4day'));
  await expect(page.locator('#calendar .w-calendar-day-column')).toHaveCount(4);

  await page.locator('#calendar').evaluate((calendar) => {
    calendar.setAttribute('type', 'custom-daily');
    calendar.setAttribute('start', '2026-06-08');
    calendar.setAttribute('end', '2026-06-10');
  });
  await expect(page.locator('#calendar .w-calendar-day-column')).toHaveCount(3);
});

test('w-calendar accepts event arrays, field mappings, colors, and event clicks', async ({ mount, page }) => {
  await mount(`
    <w-calendar
      id="calendar"
      value="2026-06-13"
      event-name="title"
      event-start="begins"
      event-end="finishes"
      event-color="tone"
      event-text-color="ink"
      event-timed="isTimed"
    ></w-calendar>
  `);
  await recordEvents(page, '#calendar', ['click']);
  await page.locator('#calendar').evaluate((calendar) => {
    calendar.events = [
      {
        id: 1,
        title: 'Design review',
        begins: '2026-06-13 09:00',
        finishes: '2026-06-13 10:30',
        tone: '#155e75',
        ink: '#ffffff',
        isTimed: true,
      },
      {
        id: 2,
        title: 'Release day',
        begins: '2026-06-18',
        finishes: '2026-06-18',
        tone: 'success',
      },
    ];
  });

  await expect(page.locator('#calendar .w-calendar-event')).toHaveCount(2);
  const designReview = page.locator('#calendar .w-calendar-event[data-event-index="0"]');
  await expect(designReview).toContainText('Design review');
  await expect(designReview).toHaveCSS('--w-calendar-event-color', '#155e75');
  await designReview.click();

  const events = await readEvents(page, '#calendar');
  expect(events).toHaveLength(1);
  expect(events[0].detail).toMatchObject({
    kind: 'event',
    date: '2026-06-13',
    event: { id: 1, title: 'Design review' },
  });
});

test('w-calendar accepts JSON event and category array attributes', async ({ mount, page }) => {
  await mount(`
    <w-calendar
      id="calendar"
      type="category"
      value="2026-06-13"
      categories='["Design","Operations"]'
      category-show-all
      first-interval="9"
      interval-count="3"
      events='[{"name":"Wireframes","start":"2026-06-13 09:00","end":"2026-06-13 10:00","category":"Design"},{"name":"Deploy","start":"2026-06-13 10:00","end":"2026-06-13 11:00","category":"Operations"}]'
    ></w-calendar>
  `);

  await expect(page.locator('#calendar .w-calendar-category-column')).toHaveCount(2);
  await expect(page.locator('#calendar .w-calendar-event')).toHaveCount(2);
  await expect(page.locator('#calendar .w-calendar-category-header')).toHaveText(['Design', 'Operations']);
});

test('w-calendar limits crowded month events and emits more metadata', async ({ mount, page }) => {
  const events = Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    name: `Event ${index + 1}`,
    start: '2026-06-13',
    end: '2026-06-13',
  }));
  await mount('<w-calendar id="calendar" value="2026-06-13" event-more-text="{count} additional"></w-calendar>');
  await recordEvents(page, '#calendar', ['click']);
  await page.locator('#calendar').evaluate((calendar, value) => { calendar.events = value; }, events);

  await expect(page.locator('#calendar [data-date-cell="2026-06-13"] .w-calendar-event')).toHaveCount(3);
  const more = page.locator('#calendar [data-date-cell="2026-06-13"] .w-calendar-more');
  await expect(more).toHaveText('2 additional');
  await more.click();

  const recorded = await readEvents(page, '#calendar');
  expect(recorded[0].detail).toMatchObject({ kind: 'more', date: '2026-06-13', hidden: 2 });

  await page.locator('#calendar').evaluate((calendar) => calendar.setAttribute('event-more', 'false'));
  await expect(page.locator('#calendar .w-calendar-more')).toHaveCount(0);
  await expect(page.locator('#calendar [data-date-cell="2026-06-13"] .w-calendar-event')).toHaveCount(5);
});

test('w-calendar renders category schedules and maps event categories', async ({ mount, page }) => {
  await mount(`
    <w-calendar
      id="calendar"
      type="category"
      value="2026-06-13"
      categories='["Design","Operations"]'
      interval-count="3"
      first-interval="9"
    ></w-calendar>
  `);
  await page.locator('#calendar').evaluate((calendar) => {
    calendar.events = [
      { name: 'Wireframes', start: '2026-06-13 09:00', end: '2026-06-13 10:00', category: 'Design' },
      { name: 'Deploy', start: '2026-06-13 10:00', end: '2026-06-13 11:00', category: 'Operations' },
    ];
  });

  await expect(page.locator('#calendar .w-calendar-category-column')).toHaveCount(2);
  await expect(page.locator('#calendar .w-calendar-category-header')).toHaveText(['Design', 'Operations']);
  await expect(page.locator('#calendar [data-category="Design"] .w-calendar-event')).toContainText('Wireframes');
  await expect(page.locator('#calendar [data-category="Operations"] .w-calendar-event')).toContainText('Deploy');
});

test('w-calendar supports weekday filtering, long labels, hidden headers, and custom weekly ranges', async ({ mount, page }) => {
  await mount(`
    <w-calendar
      id="calendar"
      value="2026-06-13"
      weekdays="[1,2,3,4,5]"
      first-day-of-week="1"
      short-weekdays="false"
      locale="en-US"
      hide-header
    ></w-calendar>
  `);

  await expect(page.locator('#calendar .w-calendar-header')).toHaveCount(0);
  await expect(page.locator('#calendar .w-calendar-weekday')).toHaveCount(5);
  await expect(page.locator('#calendar .w-calendar-weekday').nth(0)).toHaveText('Monday');

  await page.locator('#calendar').evaluate((calendar) => {
    calendar.setAttribute('type', 'custom-weekly');
    calendar.setAttribute('start', '2026-06-08');
    calendar.setAttribute('end', '2026-06-19');
  });
  await expect(page.locator('#calendar .w-calendar-week')).toHaveCount(2);
  await expect(page.locator('#calendar [data-date-cell="2026-06-08"]')).toHaveCount(1);
  await expect(page.locator('#calendar [data-date-cell="2026-06-19"]')).toHaveCount(1);
});

test('w-calendar supports formatter, accessor, array, and interval style properties', async ({ mount, page }) => {
  await mount('<w-calendar id="calendar" type="day" value="2026-06-13" interval-count="2"></w-calendar>');
  await page.locator('#calendar').evaluate((calendar) => {
    calendar.weekdays = [6];
    calendar.weekdayFormat = () => 'Weekend';
    calendar.dayFormat = (day) => `D${day.day}`;
    calendar.intervalFormat = (interval) => `T${interval.time}`;
    calendar.showIntervalLabel = (interval) => interval.index === 0;
    calendar.intervalStyle = (interval) => ({ backgroundColor: interval.index === 1 ? 'rgb(220, 239, 243)' : 'transparent' });
    calendar.firstTime = { hour: 9, minute: 30 };
  });

  await expect(page.locator('#calendar .w-calendar-day-header span')).toHaveText('Weekend');
  await expect(page.locator('#calendar .w-calendar-day-header button')).toHaveText('D13');
  await expect(page.locator('#calendar .w-calendar-time-label')).toHaveText(['T09:30', '']);
  await expect(page.locator('#calendar .w-calendar-interval').nth(1)).toHaveCSS('background-color', 'rgb(220, 239, 243)');
});

test('w-calendar supports vanilla rendering callbacks for Vuetify slot variations', async ({ mount, page }) => {
  await mount('<w-calendar id="calendar" type="day" value="2026-06-13" first-interval="9" interval-count="2"></w-calendar>');
  await page.locator('#calendar').evaluate((calendar) => {
    calendar.dayHeaderContent = ({ present }) => present ? '<strong>Today</strong>' : '<span>Focus</span>';
    calendar.intervalHeaderContent = () => '<span>Time</span>';
    calendar.intervalContent = ({ hour }) => `<span>${hour} o'clock</span>`;
    calendar.dayBodyContent = (_, component) => `<span class="w-calendar-current-time" style="top:${component.timeToY('09:30')}px"></span>`;
    calendar.eventContent = ({ event }) => `<strong>${event.name}</strong>`;
    calendar.events = [{ name: 'Review', start: '2026-06-13 09:00', end: '2026-06-13 10:00' }];
  });

  await expect(page.locator('#calendar .w-calendar-day-header-content')).toContainText('Focus');
  await expect(page.locator('#calendar .w-calendar-gutter-head')).toHaveText('Time');
  await expect(page.locator('#calendar .w-calendar-interval-content')).toHaveText(["9 o'clock", "10 o'clock"]);
  await expect(page.locator('#calendar .w-calendar-current-time')).toHaveAttribute('style', /top:24px/);
  await expect(page.locator('#calendar .w-calendar-event strong')).toHaveText('Review');

  await page.locator('#calendar').evaluate((calendar) => {
    calendar.setAttribute('type', 'month');
    calendar.dayContent = ({ date }) => date === '2026-06-13' ? '<span>Milestone</span>' : '';
  });
  await expect(page.locator('#calendar [data-date-cell="2026-06-13"] .w-calendar-day-content')).toHaveText('Milestone');
});

test('w-calendar moves draggable events with native drag and drop', async ({ mount, page }) => {
  await mount(`
    <w-calendar
      id="calendar"
      type="day"
      value="2026-06-13"
      first-interval="9"
      interval-count="4"
      event-draggable
      events='[{"name":"Review","start":"2026-06-13 09:00","end":"2026-06-13 10:00"}]'
    ></w-calendar>
  `);
  await recordEvents(page, '#calendar', ['change']);

  await page.locator('#calendar').evaluate((calendar) => {
    calendar._dragEventIndex = 0;
    const target = calendar.querySelector('[data-interval="2026-06-13 11:00"]');
    target.dispatchEvent(new Event('drop', { bubbles: true, cancelable: true }));
  });

  await expect(page.locator('#calendar .w-calendar-event')).toContainText('11 AM Review');
  const events = await readEvents(page, '#calendar');
  expect(events).toHaveLength(1);
  expect(events[0].detail).toMatchObject({
    reason: 'event-drop',
    date: '2026-06-13',
    time: '11:00',
    event: {
      start: '2026-06-13 11:00',
      end: '2026-06-13 12:00',
      timed: true,
    },
  });
});

test('w-calendar applies event geometry, overlap, ripple, and category visibility attributes', async ({ mount, page }) => {
  await mount(`
    <w-calendar
      id="calendar"
      type="day"
      value="2026-06-13"
      first-interval="9"
      interval-count="4"
      event-height="24"
      event-margin-bottom="2"
      event-overlap-mode="column"
      event-overlap-threshold="30"
      event-ripple
    ></w-calendar>
  `);
  await page.locator('#calendar').evaluate((calendar) => {
    calendar.events = [
      { name: 'Alpha', start: '2026-06-13 09:00', end: '2026-06-13 10:00' },
      { name: 'Beta', start: '2026-06-13 09:30', end: '2026-06-13 10:30' },
    ];
  });

  await expect(page.locator('#calendar .w-calendar-schedule')).toHaveCSS('--w-calendar-event-height', '24px');
  await expect(page.locator('#calendar .w-calendar-event')).toHaveCount(2);
  await expect(page.locator('#calendar .w-calendar-event').nth(0)).toHaveClass(/w-ripple/);
  await expect(page.locator('#calendar .w-calendar-event').nth(0)).toHaveAttribute('style', /width:50%/);
  await expect(page.locator('#calendar .w-calendar-event').nth(1)).toHaveAttribute('style', /left:50%/);

  await page.locator('#calendar').evaluate((calendar) => {
    calendar.setAttribute('type', 'category');
    calendar.setAttribute('categories', '["Design","Operations","Sales"]');
    calendar.setAttribute('category-show-all', '');
  });
  await expect(page.locator('#calendar .w-calendar-category-column')).toHaveCount(3);

  await page.locator('#calendar').evaluate((calendar) => {
    calendar.removeAttribute('category-show-all');
    calendar.setAttribute('category-hide-dynamic', '');
  });
  await expect(page.locator('#calendar .w-calendar-category-column')).toHaveCount(0);
});

test('w-calendar supports colored interval highlights and custom overlap functions', async ({ mount, page }) => {
  await mount(`
    <w-calendar
      id="calendar"
      type="day"
      value="2026-06-13"
      first-interval="9"
      interval-count="3"
      interval-highlight="success"
    ></w-calendar>
  `);
  await page.locator('#calendar').evaluate((calendar) => {
    calendar.eventOverlapMode = (events) => () => events.map((event, index) => ({
      event,
      left: index * 25,
      width: 25,
    }));
    calendar.events = [
      { name: 'Alpha', start: '2026-06-13 09:00', end: '2026-06-13 10:00' },
      { name: 'Beta', start: '2026-06-13 09:30', end: '2026-06-13 10:30' },
    ];
  });

  await expect(page.locator('#calendar .w-calendar-schedule')).toHaveCSS(
    '--w-calendar-interval-highlight',
    '#81c784',
  );
  await expect(page.locator('#calendar .w-calendar-event').nth(0)).toHaveAttribute('style', /left:0%.*width:25%/);
  await expect(page.locator('#calendar .w-calendar-event').nth(1)).toHaveAttribute('style', /left:25%.*width:25%/);
});

test('w-calendar exposes range, movement, time geometry, and refresh helpers', async ({ mount, page }) => {
  await mount('<w-calendar id="calendar" type="week" value="2026-06-10" now="2026-06-10 12:15" first-interval="8" interval-count="24"></w-calendar>');
  await recordEvents(page, '#calendar', ['change', 'moved']);

  const range = await page.locator('#calendar').evaluate((calendar) => calendar.getVisibleRange());
  expect(range).toEqual({ start: '2026-06-07', end: '2026-06-13', type: 'week' });

  const api = await page.locator('#calendar').evaluate((calendar) => ({
    title: calendar.title,
    today: calendar.times.today,
    pixels: calendar.minutesToPixels(90),
    delta: calendar.timeDelta('12:00'),
    y: calendar.timeToY({ hour: 12, minute: 0 }),
    checked: calendar.checkChange(),
    updated: calendar.updateTimes(),
    scrolled: calendar.scrollToTime('12:00'),
  }));
  expect(api).toMatchObject({
    title: 'Jun 7–13, 2026',
    today: '2026-06-10',
    pixels: 72,
    delta: 1 / 6,
    y: 192,
    checked: { reason: 'check', start: '2026-06-07', end: '2026-06-13' },
    scrolled: true,
  });

  const scrollTop = await page.locator('#calendar .w-calendar-schedule-scroll').evaluate((element) => element.scrollTop);
  expect(scrollTop).toBeGreaterThan(0);

  await page.locator('#calendar').evaluate((calendar) => calendar.next());
  const events = await readEvents(page, '#calendar');
  expect(events.map((event) => event.type)).toEqual(['change', 'change', 'moved']);
  expect(events[2].detail).toMatchObject({ reason: 'move', value: '2026-06-17' });
});
