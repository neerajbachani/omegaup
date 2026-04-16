import { mount } from '@vue/test-utils';
import VoerroTagsInput from './VoerroTagsInput.vue';

describe('VoerroTagsInput (omegaUp vendored) accent-insensitive typeahead', () => {
  const tags = [
    { key: 'ordenando-dos-numeros', value: 'Ordenando Números' },
    { key: 'division-ab', value: 'División a/b' },
    { key: 'calculo-dep', value: 'Cálculo Dependiente' },
  ];

  function mountTypeahead() {
    return mount(VoerroTagsInput, {
      propsData: {
        existingTags: tags,
        value: [],
        typeahead: true,
        typeaheadActivationThreshold: 2,
      },
    });
  }

  it('matches accented titles when searching without accents', async () => {
    const wrapper = mountTypeahead();

    await wrapper.setData({ input: 'ordenando nu' });
    await wrapper.vm.$nextTick();
    wrapper.vm.searchTag();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.searchResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'ordenando-dos-numeros',
          value: 'Ordenando Números',
        }),
      ]),
    );
  });

  it('matches División when query has no accent', async () => {
    const wrapper = mountTypeahead();

    await wrapper.setData({ input: 'division' });
    await wrapper.vm.$nextTick();
    wrapper.vm.searchTag();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.searchResults.map((t) => t.key)).toContain('division-ab');
  });

  it('strips HTML before matching so unaccented query hits accented title in label', async () => {
    const withHtml = [
      {
        key: 'ordenando-dos-numeros',
        value:
          '01.- Ordenando Números (<strong>ordenando-dos-numeros</strong>)',
      },
    ];
    const wrapper = mount(VoerroTagsInput, {
      propsData: {
        existingTags: withHtml,
        value: [],
        typeahead: true,
        typeaheadActivationThreshold: 2,
      },
    });

    await wrapper.setData({ input: 'ordenando nu' });
    await wrapper.vm.$nextTick();
    wrapper.vm.searchTag();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.searchResults).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'ordenando-dos-numeros' }),
      ]),
    );
  });
});
