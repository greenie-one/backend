#!/bin/bash 

BASE_DIR=$GITHUB_WORKSPACE

copy_dtos() {
  rm -rf "${BASE_DIR}/global-dtos/src"
  mkdir -p "${BASE_DIR}/global-dtos/src"
  cp -r "${BASE_DIR}/backend/src/dtos" "${BASE_DIR}/global-dtos/src"
}

strip() {
  # Strip all decorators
  find "${BASE_DIR}/global-dtos/src/" -type f -exec sed -i -E "s/^\s*@(.*)//" {} \;

  # Remove all class-validator imports
  find "${BASE_DIR}/global-dtos/src/" -type f -exec sed -i -E "s/^(.*)class-validator';$//" {} \;

  # Remove all class-transformer imports
  find "${BASE_DIR}/global-dtos/src/" -type f -exec sed -i -E "s/^(.*)class-transformer';$//" {} \;

  # Remove all imports starting with @/
  find "${BASE_DIR}/global-dtos/src/" -type f -exec sed -i -E "s/^(.*)@\/(.*)$//" {} \;

  # Remove double new lines
  find "${BASE_DIR}/global-dtos/src/" -type f -exec sed -i '/^$/d' {} \;

  # Add a new line after closing }
  find "${BASE_DIR}/global-dtos/src/" -type f -exec sed -i -E 's/}$/}\n/' {} \;
}

export_all() {
  DIR_STRING=$(find "${BASE_DIR}/global-dtos/src/dtos" -type f -exec realpath --relative-to "${BASE_DIR}/global-dtos/src/" {} \;)
  read -a DIRS <<< "$DIR_STRING"
  for i in "${DIRS[@]}"
  do
    NO_EXT=${i::-3}
    echo "export * from './${NO_EXT}'" >> "${BASE_DIR}/global-dtos/src/index.ts"
  done
}

# copy_dtos
# strip
export_all