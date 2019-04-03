import { schema } from 'normalizr';
import { colors } from './config';

const toppingSchema = new schema.Entity('topping');
const filterSchema = new schema.Entity('filter');

const pizzaSchema = new schema.Entity('pizza', {}, {
  idAttribute: 'name',
  processStrategy: (value) => ({
    ...Object.keys(value)
      .filter(key => key !== 'toppings' && key !== 'name')
      .reduce((obj, key) => ({
        ...obj,
        [key.replace(/ /gi,'')]: Number(value[key]),
      }), {}),
    filters: Object.keys(value)
        .filter(key => key !== 'toppings' && key !== 'name')
        .map((key, index) => ({
          id: key.replace(/ /gi,''),
          label: key,
          name: key,
          order: index,
          color: colors[index % colors.length],
          active: true,
        })),
    toppings: value.toppings.split(', ').map((i) => ({ label: i, id: i })),
  }),
});
pizzaSchema.define({
  toppings: new schema.Array(toppingSchema),
  filters: new schema.Array(filterSchema),
});

const mySchema = new schema.Array(pizzaSchema);

export default mySchema;
